# QSForms
Forms for qlik sense

## Description
Extension allows you to create survey forms and send the result through a web service.
![image](https://user-images.githubusercontent.com/78903921/176679531-e3bd8ed9-5ce0-44de-a595-7f8818757481.png)

## Configuration

### Form parametres
![image](https://user-images.githubusercontent.com/78903921/176674966-7bac85c7-30a8-4462-adf8-6e4094f82fa3.png)
  
**id form** - The ID of the form that is used to determine if the user completed the survey. For each new survey, a new identifier must be defined.  
  
**Form label** - Title of survey for user.  
  
**Can only be passed once?** - Can a user complete the survey more than once. The fact of passing the survey comes from the web service. 
  
**Message for users who have already completed the survey**  

### Display mode
![image](https://user-images.githubusercontent.com/78903921/176681146-1e3bfa2c-673e-482f-bff2-954b436613e5.png)

Poll display. Popup window or inside extension  
If you select a pop-up, additional settings will appear  
![image](https://user-images.githubusercontent.com/78903921/176688023-1f97cb03-a0a1-4a62-a06e-9ddcea57275b.png)  
**Block another content?** - Should all other content be blocked?    
**Can the user close the form?** - Can the user close the popup  
**Form not showing after closing?** - If the user closed the popup, it will only appear after the extension sheet is reopened. Or will open every time the trigger fires

**Add trigger**

![image](https://user-images.githubusercontent.com/78903921/176689148-91fb4c8b-d025-4ca0-8315-e48f2742446f.png)

You can add a trigger on a timeout or on a selection change event in the field

Specify the time in seconds after which a pop-up window will appear. It is necessary to specify for each trigger separately. If there are several triggers and some of them work, then the form will be shown after the minimum timeout of the specified

**Form position**

![image](https://user-images.githubusercontent.com/78903921/176690047-1ad55d24-eb50-4102-91d5-e359f6bcec26.png)


Specify the size and position of the popup


### Form configuration

![image](https://user-images.githubusercontent.com/78903921/176682390-b852bd6e-796c-4e3e-8307-c76129fe5741.png)

**Form type** - All questions at the same time or one question at a time

Click the button to add a question

![image](https://user-images.githubusercontent.com/78903921/176682879-6c666281-5ebb-48b7-a213-5ff4171cae2d.png)

Type the text of the question

You can choose from four question types
1. Text input
2. Multiple select
3. Single select
4. Grade

**Text input**

![image](https://user-images.githubusercontent.com/78903921/176683643-d6aac6dc-78ee-4d7f-a4dd-565f8233f06c.png)

No additional settings are required. Only specify the name of the button that will take you to another question if the form type is One card at a time

**Multiple select**

![image](https://user-images.githubusercontent.com/78903921/176685359-bdd9468c-459f-4886-96c6-32a77264ddff.png)

Similar to text input settings.

You must add answers. To do this, click on the button and in the window that appears, enter the text from

![image](https://user-images.githubusercontent.com/78903921/176685718-620354c3-aa16-49f3-8338-e65c61d03b4c.png)

**Single select**

Completely similar to Multiple select  
And you can choose how to confirm the answer, if you choose to show one card at a time  
If you select by button, then the question will be considered answered when the user clicks on this button. If by input, then the question will be considered answered the first time the user selects an answer

**Grade**

![image](https://user-images.githubusercontent.com/78903921/176687424-b38b68aa-0e63-479d-8b42-0de3783e60f2.png)

Enter the minimum value and maximum available for the user to enter a rating

### Web service params

![image](https://user-images.githubusercontent.com/78903921/176690183-a4a1b731-54d5-4369-a4da-645d5493c9ce.png)

Enter the web service address

##Example of web service
Extension send json when the sruvey completed

![image](https://user-images.githubusercontent.com/78903921/176692676-c58a487b-6813-4192-8196-9e6451e45f34.png)

And asks for a json if the user can only take the survey once

![image](https://user-images.githubusercontent.com/78903921/176693222-42cd903a-602c-4cea-8549-6b5ec5e6bbd0.png)

**You can write your own web service that will receive and return similar data and write it to any source. I will show an example of the implementation of a record in a Google spreadsheet. It's fast and free :)**

1. Create and open google table
2. Select Extensions - Apps Script  
![image](https://user-images.githubusercontent.com/78903921/176696405-736fb7d5-971e-40ff-b535-12a44f84ff03.png)
3. Copy code from [appScript.gs](https://github.com/SemenovDaniil/QSForms/blob/main/appScript.gs) and paste into Code.gs  
![image](https://user-images.githubusercontent.com/78903921/176697344-2a9556be-cefc-4258-8636-571e06c97312.png)
4. Click "Deploy" and select "New deployment"    
![image](https://user-images.githubusercontent.com/78903921/176697530-b65440f7-86f7-4341-be13-4e47829566de.png)
5. Then select type "Web app"   
![image](https://user-images.githubusercontent.com/78903921/176697776-af67f357-435f-44bc-bc97-516adc2ea4ff.png)
6. Configure web app  
![image](https://user-images.githubusercontent.com/78903921/176698282-f1db4be9-52e5-477a-8d38-cd286eedfcd2.png)
7. Click "Deploy" and authorize access
8. **You will see a link. Copy and paste it into the extension. Now everything should work.**  
![image](https://user-images.githubusercontent.com/78903921/176698859-f89f11ec-d96e-4a95-9e04-b370a42d2e86.png)


**You can write your own web service that will receive and return similar data and write it to any source. I will show an example of the implementation of a record in a Google spreadsheet. It's fast and free :)**
