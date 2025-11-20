**Sprint Goal**
Improve patient experience, expand role-based features, and build foundational dashboards.

**Goal Achievement**
_Partially achieved._
Core features were completed (intake form, dashboards, bug fixes), but authentication complexities prevented a smooth patient login experience.

**Completed User Stories**
| Story                  | Description                                                             | Notes                                                 |
| ---------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| Psychiatrist Dashboard | Shows intake summaries; click to expand full details                    | Fully implemented                                     |
| Patient Sign-Up        | Email-based sign-up                                                     | Built but authentication too complex → needs redesign |
| Patient Dashboard      | Patients can view appointment requests & edit intake form while pending | Completed                                             |
| Intake Form            | Full intake form built and integrated                                   | Completed                                             |
| Fix Sign-Out Bug       | Logout now correctly terminates sessions                                | Completed                                             |
| UI Update              | Patient sign-up button now always in upper right                        | Completed                                             |

**Incomplete / Deferred Stories**
| Story                      | Reason                          | Disposition                                |
| -------------------------- | ------------------------------- | ------------------------------------------ |
| Robust authentication flow | Too complex for current system  | Move to Sprint 4 as “Auth System Redesign” |
| Additional data cleanup    | Data quality still inconsistent | Continue into Sprint 4                     |
| Data Cleanup           | Improved dataset for profiles + specialties                             | Data low-quality; postoned to Sprint 4               |

**Demo Notes / User Journey Demonstrated**
You can now demo:

Psychiatrist Journey
- Sign in
- View dashboard with summary of intake forms
- Click to expand full intake form
- Log out (sign-out bug fixed)

Patient Journey
- Sign up with email (MVP version)
- Submit intake form
- View appointment requests on patient dashboard
- Edit intake form while request is pending
- Sign out

**Metrics**
- Planned Story Points: 14
- Completed Story Points: 24 (swapped data cleaning with patient dashboard / signup)
- Velocity (Sprint 3): 24
- Cumulative Velocity (Sprints 2–3): 23 + 24 = 47

**Backlog Refinements**
- Add “Email notifications to psychiatrist” (5 pts)
- Add “Patient dashboard filters (status, date)” (3 pts)
- Add “UI polish for profile page” (2 pts)
- Stretch: analytics for admin dashboard
