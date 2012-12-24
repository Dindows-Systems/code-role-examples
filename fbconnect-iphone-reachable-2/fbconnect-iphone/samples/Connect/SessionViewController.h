/*
 * Copyright 2009 Facebook
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

#import "FBConnect/FBConnect.h"
#import "PermissionStatus.h"
#import "Reachability.h"

@class FBSession;

@interface SessionViewController : UIViewController
    <FBDialogDelegate, FBSessionDelegate, FBRequestDelegate, PermissionStatusDelegate> {
		IBOutlet UILabel* _label;
		IBOutlet UIButton* _permissionButton;
		IBOutlet UIButton* _feedButton;
		IBOutlet FBLoginButton* _loginButton;
		FBSession* _session;
		PermissionStatus *permissionStatusForUser;
		NetworkStatus internetConnectionStatus;
		NetworkStatus remoteHostStatus;
}

@property(nonatomic,readonly) UILabel* label;
@property (nonatomic, retain) PermissionStatus *permissionStatusForUser;
@property NetworkStatus internetConnectionStatus;
@property NetworkStatus remoteHostStatus;

- (void)askPermission:(id)target;
- (void)publishFeed:(id)target;
- (void)reachabilityChanged:(NSNotification *)note;
- (void)updateStatus;
- (void)initStatus;

@end
