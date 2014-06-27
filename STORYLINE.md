>> maintaining time in CAT2 was never so smart/ easy/ fun <<

..announcing Bridge
- bridge is a new web based dashboard for employees which integrates into multiple systems at SAP and offers a new way to do time recording in CAT2.. you can access it at https://bridge.mo.sap.corp
- but what is bridge exactly and how and why was it built?

..the story behind
- huge # of systems used each day at SAP to find relevant information like outlook, css/ crm, jira, wiki, communities, .. (only to list a few)
- one existing application, the employee dashboard integrates with a lot of these internal systems in order to
-- visualize helpful and important information
-- serve as a central point of access to various information sources to increase efficiency
- the employee dashboard has around 6000 active users per months and overall employees really like to use it on a daily basis
- but, we also received a lot of feedback via idea management, surveys, communities and directly that
-- the current infrastructure is outdated: only running on windows pcs, huge startup time and memory consumption, user interface not up to date
-- c# knowledge needed to develop own applications (so it is really hard and only very few colleagues are able to contribute)
- some quotes from our interviews
- "I use a Mac and need to log on to WTS to use the Employee Dashboard"
- "I would like to enter data directly, like entering CAT2 entries"
- "A Fiori-like UI would be more fun to use"
- "Please make a web based app with simple interaction patterns"
- "..look up the meeting room of the upcomming meeting"

..challenge
- provide a dashboard on top of a modern infrastructure
- embrance inner source and collaboration
- focus on overall end user experience

..solution
- selected internal GitHub instance as collaboration plaform to host our source code and infrastructure code: https://github.wdf.sap.corp/bridge/bridge
- everyone can contribute via the well know fork/ pull request method on GitHub without requesting any authorization
- everyone can create issues in our GitHub repository to provide feedback or request new features
- to learn how to use git and github, check out the GitHub bootcamp: https://github-bootcamp.mo.sap.corp/
- it is a web based solution running in modern browsers (IE10+, Chrome, Firefox, Safari) to not compromise on overall experience
- additional client application is optional for advanced features like accessing your meetings from the exchange server
- everything is javascript based (also the server which is written with node.js) which is very easy to learn
- solution can be accessed via one simple URL: https://bridge.mo.sap.corp

..finally: easy cat2 time recording
- was raised as one of out seven pain points within a company wide survey on the simplification of the top 7 employee facing processes: https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/Infocenters/WS%20COO/Chief%20Process%20Office/Top%207%20Employee%20Facing%20Processes/index_new.html
- is now easily possible with bridge.. just click on a date in the overview and maintain your time for one or multiple days with a simple slider and hit save

-






