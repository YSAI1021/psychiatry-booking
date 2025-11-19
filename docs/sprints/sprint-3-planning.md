**Sprint Goal**
Deliver key patient-facing improvements and begin expanding role-based features by:
- Building a functional patient intake form
- Adding filter-by-specialty to the home page directory
- Completing essential bug fixes and UI improvements
- Preparing data cleanup for smoother upcoming dashboard work

**Selected User Stories**
| #  | User Story                                  | Description                                                              | Points                     |
| -- | ------------------------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| 16 | Build Intake Form                           | Allow patients to submit brief, non-sensitive information before booking | 5                          |
| 17 | Filter by Psychiatrist Specialty            | Add specialty filter on home directory                                   | 3                          |
| 18 | Fix Sign-out Bug                            | Ensure sign-out reliably logs out user session                           | 2                          |
| 19 | Update Appointment Times (30-min intervals) | Improve patient booking experience                                       | 1                          |
| 20 | Data Cleanup                                | Improve data consistency for future dashboards                           | 3                          |
| 21 | Patient Signup (Low Priority)               | Allow patient account creation                                           | 5 (not committed, stretch) |
| 22 | Patient Dashboard (Low Priority)            | Allow patients to view their appointment requests                        | 8 (not committed, stretch) |

**Committed Story Points: 14**
(Stories 21–22 are stretch goals and not committed.)

**Team Assignments**

Yiqi
- Fix sign-out bug (#18)
- Update appointment time selection (#19)
- Add specialty filter (#17)

Cindy
- Build patient intake form (#16)

Laure
- Data cleanup (#20)

**Dependencies & Risks**
- Specialty filter depends on available & clean specialty data (dependency on Laure’s data cleanup).
- Intake form requires stable backend endpoint design—risk: backend delays.
- Patient signup + dashboard are stretch goals and may spill into Sprint 4.
- Bug fixes may uncover deeper auth/session issues.
