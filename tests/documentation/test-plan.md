# Barbershop Web Application Test Plan

## 1. Introduction

This test plan outlines the testing approach for the Barbershop Web Application. The plan focuses on ensuring the application's core functionality works correctly, with a simplified approach suitable for a student project.

### 1.1 Purpose

The purpose of this test plan is to:

- Verify that the application meets its functional requirements
- Identify and address any defects before submission
- Demonstrate testing knowledge as part of the project requirements

### 1.2 Scope

The testing will cover:

- User authentication (registration, login, logout)
- Appointment booking process
- User profile management
- Admin functions
- API endpoints
- Basic responsive design

## 2. Testing Strategy

### 2.1 Testing Levels

- **Unit Testing**: Limited to key components
- **Integration Testing**: API endpoints and database interactions
- **System Testing**: End-to-end user flows
- **Acceptance Testing**: Verification against requirements

### 2.2 Testing Types

- **Functional Testing**: Verify all features work as expected
- **UI Testing**: Verify user interface elements and responsive design
- **API Testing**: Verify API endpoints return correct responses
- **Cross-browser Testing**: Limited to Chrome (primary)

## 3. Test Environment

### 3.1 Hardware

- Desktop/laptop computer for development and testing

### 3.2 Software

- Operating System: Windows 10
- Web Server: Apache (XAMPP)
- Database: MySQL
- Browsers: Chrome (primary)
- Testing Tools: Selenium WebDriver, Postman

### 3.3 Test Data

- Test user accounts
- Sample appointments
- Test review tokens

## 4. Test Cases

Test cases are organized by functionality and documented in the following locations:

- Selenium test scripts in the `selenium` directory
- Postman collection in the `postman` directory
- Manual testing checklist in `manual-testing-checklist.md`

## 5. Testing Schedule

| Phase            | Activities                           | Duration |
| ---------------- | ------------------------------------ | -------- |
| Test Planning    | Create test plan, prepare test cases | 1 day    |
| Test Development | Develop automated tests              | 2 days   |
| Test Execution   | Execute tests, document results      | 1 day    |
| Bug Fixing       | Address identified issues            | 1 day    |
| Final Testing    | Verify fixes, complete documentation | 1 day    |

## 6. Roles and Responsibilities

As this is a student project, all testing roles are performed by the student:

- Test planning and design
- Test execution
- Defect reporting and verification
- Test documentation

## 7. Deliverables

- Test plan (this document)
- Test cases (Selenium scripts, Postman collection, manual checklist)
- Test results and screenshots
- Defect reports (if applicable)
- Final test summary report

## 8. Risks and Contingencies

| Risk                     | Mitigation                                 |
| ------------------------ | ------------------------------------------ |
| Limited time for testing | Focus on critical functionality first      |
| Environment setup issues | Prepare detailed setup instructions        |
| Test data management     | Create scripts to generate/reset test data |

## 9. Approval

This test plan is prepared for the Barbershop Web Application project and will be used to guide the testing process.
