# Changelog

## Unreleased / Upcoming next

* multilanguage support for English, German and Danish (/LF0380/)

### Version 0.5

* upload of files (/LF0300/, /LF0330/)

### Version 0.4

* user and role management implemented
* users can register to the platform (/LF0210/)
* users can now login (/LF0220/)
* admins receive emails regarding new registered users and activation requests of inactive user profiles
* users can reset passwords if they can't remember their password via entering the e-mail address. If the e-mail address is correct, a new password will be sent to that address (/LF0240/)
* users can change passwords on their profile page (/LF0330/)
* users can select a preferred language which will be used on the frontend and also for received emails (no dk support yet)
* users can only edit own orders (except for editors/admins)
* orders are assignable to editors (/LF0350/)
* comments, owner and editors are now based on user objects instead of strings
* fablab is now an entity with an address assignable to users as an optional field
* renaming printers to 3d-printers
* guests (not logged in users) now can only see the order list 

## Version 0.3.2

* translation fix in create order form

## Version 0.3.1

* minor cors fix

## Version 0.3

* implemented translation to English and German

## Version 0.2.1

* add dns to cors settings
* add changelog

## Version 0.2

* basic CRUDs for machines
* basic CRUDs for orders
* frontend to list machines (/LF0250/)
* frontend to list orders (/LF0260/)
* frontend to create, edit, read and delete machines (not included upload of files and CRUD for laser types and material; regarding spec /LF0370/)
* frontend to create, edit, read and delete orders (not included user model, delivery address, upload of files and timeslots for production; regarding spec /LF0300/, /LF0310/, /LF0320/, /LF0340/)
* pagination for order list and machine list
* filter by status and machine type for order list
* filter by machine type for machine list
* icon and tooltip to symbol public fields (/LF0330/)

## Version 0.1

* Init of project structure