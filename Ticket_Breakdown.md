# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here


### Ticket Breakdown

#### Ticket 1
- Ticket Id:  Feat-001
- Tictket Title: "Add customId to Agent Table"
- Ticket Description: Add a new varchar field to Agent's table. This field should be unique, not required, and act as a Foreign Key which has relations with the Facilities' table. The internally generated Databaseid, should remain as the Primary Key
- Ticket Category: Backend/DB
- Ticket estimate: 2 points
- Acceptance criteria: Every Agent should have a nullable customId field.

#### Ticket 2
- Ticket Id: Feat-002
- Ticket Title: "Facilities can add customID to Agent Table"
- Ticket Description: Facility Manager should be able to add customId while creating a new Agent. Also Facility Manager should be able to add customId to existing Agent.
- Ticket Category: Backend/Frontend
- Ticket Estimate: 7 points (This is a full stack task)
- Acceptance criteria: Facility Manger can add and update customId on new and existing agents. Comprehensive unite tests.

#### Ticket 3
- Ticket Id:  Feat-003
- Tictket Title: "Add customId to Agent Report"
- Ticket Description: When generating Agent report, Facility Manager should be able to include customId and remove db id.
- Ticket Category: Frontend
- Ticket estimate: 2 points
- Acceptance criteria: Agent Reports should include customId if required by Facility Manager.