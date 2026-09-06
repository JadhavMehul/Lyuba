# Security Fixes Report

**App:** Lyuba
**Date:** 2026-09-06

## The Problem (in plain words)

The app's server trusted whatever "user ID" the phone app sent it, without
checking if that request actually came from that person. This meant anyone
who knew (or guessed) another user's ID could:

- Read that person's private messages
- Edit that person's profile
- See who liked/matched with that person
- Fake a "like" or "swipe" as that person
- Join and read/write into any chat room in real time

This is the equivalent of a hotel handing out any room's key to anyone who
just says the room number out loud — no ID check at all.

## What Was Fixed

### 1. The server now checks "who are you, really?"
Every sensitive request must now include a secure Firebase login token. The
server verifies that token before doing anything, and always uses the
verified identity — never a name/ID the app just claims in the request.

### 2. You can only act as yourself
- Send/read messages → only your own conversations
- Edit profile → only your own profile
- Swipe / like / see matches → only your own actions and your own results
- Register → only creates/updates your own account

### 3. Live chat (real-time messaging) is now locked down
Before, anyone could connect to the chat system and eavesdrop on or send
messages into any conversation. Now the connection itself is checked, and
you can only join chat rooms you're actually part of.

### 4. Removed leftover "backdoor" endpoints
Two developer/testing routes were live on the internet with no protection
at all, letting anyone bulk-overwrite user data. They've been removed from
the public app (one of them was also broken/crashing).

### 5. Stopped logging sensitive login tokens
The server was printing full login tokens to its logs. That's been removed.

### 6. The app (phone side) now sends proof of identity
The phone app was never sending any login proof with its requests — it was
just naming a user ID. It now attaches your verified login token to every
request and to the live chat connection, matching the new server checks.

## What This Means For You

- Private messages, profiles, likes, and matches are no longer accessible
  just by knowing someone's user ID.
- No behavior changes for legitimate use — the app still works the same
  way from a user's point of view.
- Please do a real test run on a phone/simulator to confirm login → browse
  → chat still all work end-to-end before shipping, since this touched how
  every request is authenticated.

## Update — Round 2 Fixes

The four items below (originally "still open") have now been fixed too.

### 7. Fixed a crash when a chat partner has no profile photo yet
The inbox screen was crashing for any chat where the other person hadn't
uploaded a photo yet. It now shows an empty photo instead of crashing, and
also stopped fetching that person's profile twice for no reason.

### 8. Fixed a crash in match-scoring for incomplete profiles
Calculating a compatibility score between two people crashed if either
profile hadn't finished filling in their details yet. It now treats missing
details as "no info" instead of crashing.

### 9. Cleaned up the login code
The login file had two large blocks of old, commented-out code left over
from earlier drafts, plus two nearly-identical copies of the same
"verify login and look up the user" logic. Removed the dead code and merged
the duplicate logic into one shared piece of code that both login routes
now use — same behavior, less code to maintain.

### 10. One shared place for all network calls
The last screen still building its own web request by hand (the
location-lookup step during sign-up) now goes through the same shared
request helper as everywhere else. Every request the app makes now goes
through one single, consistent path.

## Update — Settings Screen Fixes

The Settings screen had four options: Edit Profile, Edit Images, Notification,
and Block List. Here's what was wrong with each and what's been done.

### Edit Profile
Already worked correctly — loads your profile, lets you edit it, saves it.
No changes needed.

### Edit Images
This screen didn't actually do anything. It never loaded your existing
photos, and the "Save" button had no action behind it at all — tapping it
did nothing. It now:
- Loads your current photos when you open the screen
- Lets you replace/remove individual photos like before
- Actually uploads your changes and saves them when you tap Save

A new "update pictures" endpoint was added to the server to support this,
reusing the same photo-upload logic the sign-up screen already had (instead
of duplicating it).

### Notification
The on/off switch was decorative — flipping it didn't do anything at all.
There's no push-notification system built yet, so the honest, correct fix
was to connect the switch to your phone's actual notification permission:
turning it on asks your phone for permission (or sends you to Settings if
you'd previously said no); turning it off explains that only your phone's
Settings can actually revoke that permission, and offers to open them.

### Block List
This didn't exist — no screen, and tapping "Block List" did nothing. Added:
- A real Block List screen showing everyone you've blocked, with an
  "Unblock" button for each
- A "Block" button on someone's profile screen (there was previously no way
  to block anyone at all, which would've made the list permanently empty)
- Server-side support: blocking someone hides you from each other in the
  discovery feed and blocks you from messaging each other

## Status

All items from the original report, and everything from the Settings
screen, are now fixed. Nothing outstanding.

One thing worth knowing: your backend dev server was already running while
these changes were made, so it's still serving the old code — restart it
to pick up everything above.
