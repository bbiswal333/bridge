# Naming convention

## Why?
All services, factories and providers (actually all injectable stuff in AngularJS) share one common namespace. Furthermore we want to have (at least) one module per file, so loading order of files doesn't matter - this is important for automatic testing with Karma. Furthermore this improves reusability. Modules themself do not adress the problem of namespace-collisions, therefore we have to follow a schema when naming services etc..

## Schema for namming modules
We try to name our modules in a "Java-package-like" way:
``` app.catsMiniCal ```
In case expression would normally include a blank, a dot or a minus they are replaced by camelCase.

## Schema for naming services, factories, providers and anything else that can be injected
Because dots and minus' cannot be used for injected objects we just rely on camelCase here. 
For the reason of having unique names everywhere each injectable object should include the name of the module it is bound to.
``` angular.module("app.lunch", []).factory("appLunchWalldorf", function () {...});```
In case a module only contains one injectable object this object might have the same name as the object (obviously written differently). You might also consider writting names of directives completely in lowercase.

## Schema for test files
Test files should end up with .spec.js and should be placed close by the code they are testing.