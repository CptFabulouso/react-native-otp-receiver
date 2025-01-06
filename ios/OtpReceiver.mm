#import "OtpReceiver.h"

@implementation OtpReceiver
RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeOtpReceiverSpecJSI>(params);
}

- (void)expectSMSWithOTP:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
  resolve(@(false));
}

- (void)requestPhoneHint:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
  reject(@"-1", @"Unavailable on iOS", nil);
}

@end
