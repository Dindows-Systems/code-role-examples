//
//  PermissionStatus.m
//  PTLog
//
//  Created by Ellen Miner on 3/20/09.
//  Copyright 2009 RaddOnline. All rights reserved.
//

#import "PermissionStatus.h"


@implementation PermissionStatus
@synthesize userHasPermission;
@synthesize delegate;

- (PermissionStatus *)initWithUserId:(long long int)uid { 
	self = [super init];
	
	if (self) {
		NSString* fql = [NSString stringWithFormat:
						 @"select status_update from permissions where uid == %lld", uid]; 
		NSDictionary* params = [NSDictionary dictionaryWithObject:fql forKey:@"query"]; 
		[[FBRequest requestWithDelegate:self] call:@"facebook.fql.query" params:params]; 
		userHasPermission = NO;
	}
	return self;
} 

#pragma mark FBRequestDelegate
- (void)request:(FBRequest*)request didLoad:(id)result {
	NSArray *permissions = result;
	NSDictionary *permission = [permissions objectAtIndex:0];
	userHasPermission = [[permission objectForKey:@"status_update"] boolValue];
	[delegate statusWasSet:userHasPermission];
}


@end
