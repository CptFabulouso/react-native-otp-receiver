package com.otpreceiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

data class SmsContent(val message: String?, val error: String? = null)

interface SmsReceivedListener {
  fun onSmsReceived(content: SmsContent)
}

class SmsBroadcastReceiver : BroadcastReceiver() {
  private var listener: SmsReceivedListener? = null

  fun addSmsReceivedListener(listener: SmsReceivedListener) {
    this.listener = listener
  }

  override fun onReceive(context: Context, intent: Intent) {
    if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
      val extras = intent.extras
      val status: Status? = extras!![SmsRetriever.EXTRA_STATUS] as Status?

      when (status?.statusCode) {
        CommonStatusCodes.SUCCESS -> {
          val message = extras.getString(SmsRetriever.EXTRA_SMS_MESSAGE)
          this.listener?.onSmsReceived(SmsContent(message))
        }

        CommonStatusCodes.TIMEOUT -> {
          this.listener?.onSmsReceived(SmsContent(null, "TIMEOUT"))
        }
      }
    }
  }
}
