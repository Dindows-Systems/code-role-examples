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

#import "SessionViewController.h"
#import "FBConnect/FBConnect.h"

///////////////////////////////////////////////////////////////////////////////////////////////////
// This application will not work until you enter your Facebook application's API key here:

static NSString* kApiKey = @"YourAPIKey";

// Enter either your API secret or a callback URL (as described in documentation):
static NSString* kApiSecret = @"YourAPISecret";
static NSString* kGetSessionProxy = nil; // @"<YOUR SESSION CALLBACK)>";

#define kHostName @"www.facebook.com"

///////////////////////////////////////////////////////////////////////////////////////////////////

@implementation SessionViewController

@synthesize label = _label;
@synthesize permissionStatusForUser;
@synthesize internetConnectionStatus;
@synthesize remoteHostStatus;

///////////////////////////////////////////////////////////////////////////////////////////////////
// NSObject

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
  if (self = [super initWithNibName:@"SessionViewController" bundle:nibBundleOrNil]) {
    if (kGetSessionProxy) {
      _session = [[FBSession sessionForApplication:kApiKey getSessionProxy:kGetSessionProxy
                             delegate:self] retain];
    } else {
      _session = [[FBSession sessionForApplication:kApiKey secret:kApiSecret delegate:self] retain];
    }
  }
  return self;
}

- (void)dealloc {
  [_session release];
  [super dealloc];
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// UIViewController

- (void)viewDidLoad {
	//Use the Reachability class to determine if the internet can be reached.
	[[Reachability sharedReachability] setHostName:kHostName];
	//Set Reachability class to notifiy app when the network status changes.
	[[Reachability sharedReachability] setNetworkStatusNotificationsEnabled:YES];
	//Set a method to be called when a notification is sent.
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reachabilityChanged:) name:@"kNetworkReachabilityChangedNotification" object:nil];
	[self initStatus];
	[_session resume];
	_loginButton.style = FBLoginButtonStyleWide;
}

- (void)reachabilityChanged:(NSNotification *)note {
    [self updateStatus];
}

-(void)initStatus {
	self.remoteHostStatus = [[Reachability sharedReachability] remoteHostStatus];
	self.internetConnectionStatus	= [[Reachability sharedReachability] internetConnectionStatus];
}

- (void)updateStatus
{
	// Query the SystemConfiguration framework for the state of the device's network connections.
	self.remoteHostStatus = [[Reachability sharedReachability] remoteHostStatus];
	self.internetConnectionStatus	= [[Reachability sharedReachability] internetConnectionStatus];
	NSLog(@"remote status = %d, internet status = %d", self.remoteHostStatus, self.internetConnectionStatus);
	if (self.internetConnectionStatus == NotReachable && self.remoteHostStatus == NotReachable) {
		//show an alert to let the user know that they can't connect...
		UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Network Status" 
														message:@"Sorry, our network guro determined that the network is not available. Please try again later." 
													   delegate:self 
											  cancelButtonTitle:nil 
											  otherButtonTitles:@"OK", nil];
		[alert show];
	} else {
		// If the network is reachable, make sure the login button is enabled.
		_loginButton.enabled = YES;
	}
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
  return YES;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// FBDialogDelegate

- (void)dialog:(FBDialog*)dialog didFailWithError:(NSError*)error {
  _label.text = [NSString stringWithFormat:@"Error(%d) %@", error.code,
    error.localizedDescription];
}

- (void)dialogDidSucceed:(FBDialog*)dialog { 
	_permissionButton.hidden = YES;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// FBSessionDelegate

- (void)session:(FBSession*)session didLogin:(FBUID)uid {
	//_permissionButton.hidden = NO;
	_feedButton.hidden = NO;

	NSString* fql = [NSString stringWithFormat:
    @"select uid,name from user where uid == %lld", session.uid];

	NSDictionary* params = [NSDictionary dictionaryWithObject:fql forKey:@"query"];
	[[FBRequest requestWithDelegate:self] call:@"facebook.fql.query" params:params];
	
	permissionStatusForUser = [[PermissionStatus alloc] initWithUserId:session.uid];
	permissionStatusForUser.delegate = self;
}

#pragma mark RAD PermissionStatusDelegate
- (void)statusWasSet:(BOOL)status {
	_permissionButton.hidden = status;
	[permissionStatusForUser release];
}

- (void)sessionDidLogout:(FBSession*)session {
  _label.text = @"";
  _permissionButton.hidden = YES;
  _feedButton.hidden = YES;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// FBRequestDelegate

- (void)request:(FBRequest*)request didLoad:(id)result {
  NSArray* users = result;
  NSDictionary* user = [users objectAtIndex:0];
  NSString* name = [user objectForKey:@"name"];
  _label.text = [NSString stringWithFormat:@"Logged in as %@", name];
}

- (void)request:(FBRequest*)request didFailWithError:(NSError*)error {
  _label.text = [NSString stringWithFormat:@"Error(%d) %@", error.code,
    error.localizedDescription];
}

///////////////////////////////////////////////////////////////////////////////////////////////////

- (void)askPermission:(id)target {
  FBPermissionDialog* dialog = [[[FBPermissionDialog alloc] init] autorelease];
  dialog.delegate = self;
  dialog.permission = @"status_update";
  [dialog show];
}

- (void)publishFeed:(id)target {
  FBFeedDialog* dialog = [[[FBFeedDialog alloc] init] autorelease];
  dialog.delegate = self;
  dialog.templateBundleId = 99999999;
  dialog.templateData = @"{\"contest\":\"Pie Eating Contest\", \"event\":\"California State Fair\"}";
  [dialog show];
}

#pragma mark AlertView delegate methods
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
	_loginButton.enabled = NO;
	[alertView release];
}

@end
