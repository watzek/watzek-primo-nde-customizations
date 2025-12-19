## NDE Customizations for Lewis & Clark's Boley & Watzek Libraries


### Customizations added:
* Report a Problem
* Add Slaask Chat Widget
* Login Page Image - in src/assets/images, create a directory loginPage, and add an image loginPageImage.jpg. This will appear on the standalone login page (https://primo.lclark.edu/nde/login?vid=01ALLIANCE_LCC:LCCNDETEST)
* Home page cards with dynamic content (library hours)



### Notes
* Needed to update [src/app/app.module.ts](https://github.com/watzek/watzek-primo-nde-customizations/blob/main/app/app.module.ts) to import HttpClientModule and include it in the @NgModule imports list.
