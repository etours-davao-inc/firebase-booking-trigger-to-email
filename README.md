# Firebase Booking Trigger To Email
Firebase microservice for forwarding booking to reservation staff


## Deployment Notes
```
firebase deploy --only functions
```

## Setting Env Variables
```
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```

## To Env config
```
firebase functions:config:get
```