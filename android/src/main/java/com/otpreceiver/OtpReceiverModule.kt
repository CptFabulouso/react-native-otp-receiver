package com.otpreceiver

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.auth.api.phone.SmsRetrieverClient
import com.google.android.gms.tasks.Task

const val HINT_RESOLVE_CODE = 100
const val TAG = "OtpReceiverModule"

@ReactModule(name = OtpReceiverModule.NAME)
class OtpReceiverModule(private val reactContext: ReactApplicationContext) :
  NativeOtpReceiverSpec(reactContext), ActivityEventListener, LifecycleEventListener, SmsReceivedListener {

  companion object {
    const val NAME = "OtpReceiver"
  }

  private var hintPromise: Promise? = null
  private var smsClient: SmsRetrieverClient = SmsRetriever.getClient(reactContext)
  private var smsReceiverRegistered = false
  private val smsReceiver = SmsBroadcastReceiver()


  override fun getName(): String {
    return NAME
  }

  override fun initialize() {
    super.initialize()

    reactContext.addActivityEventListener(this)
    reactContext.addLifecycleEventListener(this)
    smsReceiver.addSmsReceivedListener(this)
  }

  override fun requestPhoneHint(promise: Promise){
    val activity = currentActivity ?: return
    val request = GetPhoneNumberHintIntentRequest.builder().build()
    hintPromise = promise;

    Identity.getSignInClient(activity)
      .getPhoneNumberHintIntent(request)
      .addOnSuccessListener { result ->
        try {
          activity.startIntentSenderForResult(result.intentSender, HINT_RESOLVE_CODE, null, 0, 0, 0)
        } catch (e: Exception) {
          Log.e(TAG, e.message ?: "Launching the Intent failed")
        }
      }
      .addOnFailureListener {
        Log.e(TAG, "Phone Number Hint failed")
      }
  }

  override fun expectSMSWithOTP(promise: Promise?) {
    if(promise == null){
      return
    }
    val task: Task<Void> = smsClient.startSmsRetriever()

    task.addOnSuccessListener {
      promise.resolve(true)
    }

    task.addOnFailureListener {
      promise.reject("OTP_FAILED_TO_START", it.message)
    }
  }

  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  private fun registerReceiver(){
    if(smsReceiverRegistered){
      return;
    }
    val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      reactContext.registerReceiver(
        smsReceiver,
        intentFilter,
        Context.RECEIVER_NOT_EXPORTED)
    } else {
      reactContext.registerReceiver(smsReceiver, intentFilter)
    }
    smsReceiverRegistered = true;
  }

  private fun unregisterReceiver(){
    if(!smsReceiverRegistered){
      return
    }
    reactContext.unregisterReceiver(smsReceiver)
    smsReceiverRegistered = false
  }

  /* --ActivityEventListener Start-- */
  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, intent: Intent?) {
    if(requestCode == HINT_RESOLVE_CODE){
      if(resultCode == AppCompatActivity.RESULT_OK){
        try {
          val phoneNumber = Identity.getSignInClient(reactContext).getPhoneNumberFromIntent(intent)
          hintPromise?.resolve(phoneNumber)
        } catch (e: Exception) {
          hintPromise?.reject("HINT_FAILED", e.message)
        }
      } else {
        hintPromise?.reject("HINT_FAILED", "Failed to get phone number hint")
      }
    }
  }

  override fun onNewIntent(p0: Intent?) {
    // nothing to do
  }
  /* --ActivityEventListener End-- */

  /* --LifecycleEventListener Start-- */
  override fun onHostDestroy() {
    unregisterReceiver()
  }

  override fun onHostPause() {
    unregisterReceiver()
  }

  override fun onHostResume() {
    registerReceiver()
  }
  /* --LifecycleEventListener End-- */

  /* --SmsReceivedListener Start-- */
  override fun onSmsReceived(content: SmsContent) {
    val data = Arguments.createMap().apply {
      putString("message", content.message)
      putString("error", content.error)
    }
    emitOnSMSReceived(data)
  }
  /* --SmsReceivedListener End-- */
}
