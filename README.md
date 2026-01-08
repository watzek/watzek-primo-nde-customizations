## NDE Customizations for Lewis & Clark's Boley & Watzek Libraries

[Current development site](https://primo.lclark.edu/nde/home?vid=01ALLIANCE_LCC:LCCNDETEST&lang=en).

### Customizations added:
* [Report a Problem](https://github.com/watzek/watzek-primo-nde-customizations/tree/main/app/report-problem) - provides link on full display page to external form with item details.
* [Add Slaask Chat Widget](https://github.com/watzek/watzek-primo-nde-customizations/tree/main/app/slaask-chatwidget) - imports Slaask javascript and embeds chat widget within primo.
* Login Page Image - in src/assets/images, create a directory loginPage, and add an image loginPageImage.jpg. This will appear on the standalone login page (https://primo.lclark.edu/nde/login?vid=01ALLIANCE_LCC:LCCNDETEST)
* [Home page cards](https://github.com/watzek/watzek-primo-nde-customizations/tree/main/app/library-cards) with dynamic content (library hours)
* [Not on shelf](https://github.com/watzek/watzek-primo-nde-customizations/tree/main/app/not-on-shelf) - link from physical items to google form to report missing item



### Notes
* Needed to update [src/app/app.module.ts](https://github.com/watzek/watzek-primo-nde-customizations/blob/main/app/app.module.ts) to import HttpClientModule and include it in the @NgModule imports list.

* For adding non NDE-specific files and folders, mainly for GitHub repo documentation, you can create a `.npmignore` file in the customModule-main directory. It works like `.gitignore`, where you can list files and folders to be ignored during npm build processes. Ours looks like this:

```
.git/
.gitignore
README.md
repo-images/

```
