1. Product Overview

App name: FoodProcessor
Tagline (in-app): “Turn any cooking video into a shopping list.”

Core flow (MVP):

User pastes or shares a YouTube URL into FoodProcessor.

App calls backend to extract ingredients.

App displays ingredient list as nice cards + grouped shopping list.

Free users see max 5 ingredients per video.

Premium users see all ingredients (no limit).

Only difference between free and premium:

Free: Up to 5 ingredients per extraction.

Premium: Unlimited ingredients per extraction.

No other feature differences for MVP.

2. Visual Design & Theme
2.1 Color Palette (light theme, simple to implement)

Background: #F9FAFB (very light gray)

App Bar / Headers: #FFFFFF

Primary (buttons, highlights): #22C55E (green)

Secondary Accent: #F97316 (orange)

Text main: #111827 (almost black)

Text secondary: #6B7280 (gray)

Card background: #FFFFFF

Divider / subtle borders: #E5E7EB

Error / warning: #EF4444

2.2 Typography

Use a clean, geometric sans-serif (e.g. SF Pro, Inter, Roboto depending on platform).

H1 (screen titles): 24–28 pt, bold

H2 (section titles): 18–20 pt, semi-bold

Body: 14–16 pt, regular

Small labels / metadata: 12–13 pt, medium

2.3 General Layout Guidelines

Rounded corners for cards: 12–16 px radius.

Button height: 48 px, full-width for primary CTAs.

Page padding: 16 px on all sides.

Consistent use of shadow/elevation for cards (subtle, not heavy).

No video frames or thumbnails: all illustrations should be generic icons or simple emoji-like graphics, not pulled from YouTube.

3. App Navigation Structure

MVP can be single-stack navigation; no complex tab bar needed.

Screens (in order of importance):

Home / URL Input Screen

Extraction Progress Screen (can be modal or inline state)

Results Screen (Ingredients + Shopping List)

Premium Paywall Modal (when >5 ingredients for free users)

Settings & Legal Screen (Terms & Conditions, Privacy Policy, About, Restore Purchase)

Optional: first-run consent modal for Terms & Privacy.

4. Screen-by-Screen Specs
4.1 Home Screen – “Paste a Video”

Purpose: Simple entry point to paste or receive a YouTube URL.

Layout:

App bar:

Left: App name: “FoodProcessor” (H1, bold, primary color used as small underline or dot).

Right icon: Gear / Settings icon → navigates to Settings & Legal.

Content (centered vertically on first run, scrollable later if needed):

Title: “Turn any cooking video into a shopping list”

Style: H1, center-aligned, color #111827.

Subtitle: “Paste a YouTube link or share directly from the YouTube app.”

Style: Body, center-aligned, color #6B7280.

URL input component:

Full-width rounded text field.

Placeholder: “Paste YouTube link here…”

Left icon: link icon.

Right icon: small “Paste” button (taps paste clipboard text).

Primary CTA button (full-width):

Label: “Process Video”

Color: primary #22C55E, white text, 48 px height, rounded 24 px.

Disabled state if input empty or invalid URL (gray, reduced opacity).

Secondary hint text:

Small, centered: “Tip: In YouTube, tap Share → FoodProcessor to send a video directly.”

Small link-style text: “How to share from YouTube” → opens simple modal with instructions.

Interactions:

When the user taps “Process Video”:

Validate URL (basic client validation: string non-empty + contains youtube.com or youtu.be).

Call backend: POST /api/extract with JSON body { youtube_url: "<URL>" }.

On success: receive job_id → navigate to Progress Screen (4.2), passing job_id and the original URL.

On error: show an inline error banner at top of screen:

Red background #FEE2E2, text #B91C1C:
“We couldn’t start processing this video. Please check the link and try again.”

4.2 Extraction Progress Screen

Purpose: Show the user that processing is happening and avoid confusion.

Can be implemented as a separate screen or as a full-screen modal overlay.

Layout:

App bar:

Back button: returns to Home (optional, but should show a confirmation to avoid abandoning job).

Title: “Processing video…”

Content:

Large abstract illustration: a pot, spoon, or simple animated SVG (not from video).

Centered.

Progress text (dynamic, based on polling status):

Use friendly phrases rotated over time:

“Reading the recipe…”

“Chopping the text…”

“Finding your ingredients…”

“Almost ready to serve…”

Progress indicator:

Indeterminate spinner or linear progress bar, using primary color #22C55E.

API Logic (Frontend):

Immediately start polling GET /api/status/{job_id} every 1–2 seconds.

Expect fields like status and progress:

If status is "queued" or "processing" → stay on this screen.

If status is "completed" → navigate to Results Screen with job_id.

If status is "error" or HTTP 4xx/5xx → show error message and “Try again” button.

Error UI:

Full-width error banner or dialog:

Title: “Something went wrong”

Body: “We couldn’t finish processing this video. Please try again or choose another video.”

Button: “Back to Home”

4.3 Results Screen – Ingredients + Shopping List

Purpose: Show ingredients in a visually appealing way, enforce free vs premium limits, and provide shopping list.

Assume backend response like:

ingredients: array of ingredient objects (e.g. { name: "Tomatoes", category: "Produce" })

shopping_list: grouped object

confidence: numeric or per-ingredient

Layout:

App bar:

Left: Back (to Home).

Title: “Ingredients” (or recipe-based title if available in future).

Right: Star icon or “Premium” badge if user is premium (for MVP you can just show text if premium).

Summary header section:

Small text: “From your video” + URL domain YouTube.

Display number of detected ingredients:

Example: “4 ingredients found”

If user is free and total ingredients > 5, show:

“Showing 5 of 12 ingredients (upgrade to see all).”

4.3.1 Ingredients Card List

Example with API result: Tomatoes, Mozzarella, Onions, Olive oil
(extend for more ingredients, but we’ll use this example)

Card style:

Card container:

Background: #FFFFFF

Corner radius: 12 px

Padding: 12–16 px

Small shadow / elevation 1–2

Each card contains:

Left side:

Icon or emoji for ingredient (no external images).

Tomatoes → 🍅

Mozzarella → 🧀

Onions → 🧅

Olive oil → 🫒

Middle:

Ingredient name: “Tomatoes” (bold, 16 pt).

Category label: e.g. “Produce”, “Dairy”, “Pantry” (small, #6B7280).

Right side:

Checkbox or toggle: “Need / Have”.

Default: “Need”.

Tap toggles to “Have” with color change.

List behavior:

Scrollable vertical list.

Group ingredients by category with small headers:

“Produce”

“Dairy”

“Pantry”

Category header style:

Text: 13–14 pt, uppercase, color #6B7280.

Free vs Premium behavior:

Case 1: Total ingredients ≤ 5

Show all ingredients normally.

No paywall.

Case 2: Total ingredients > 5 and user is free

Show first 5 ingredients fully.

Remaining ingredients:

Show blurred or semi-transparent cards with placeholder text like:

“Hidden ingredient #6 (Premium)”

“Hidden ingredient #7 (Premium)”

At the bottom of the list, show a premium teaser card:

Light yellow/orange background: #FFF7ED

Text:

Title: “Unlock full ingredient list”

Subtitle: “Upgrade to see all ingredients for this recipe.”

Button: “Upgrade to Premium” (opens Premium Paywall Modal).

4.3.2 Shopping List Section

Located below ingredient cards or as a second tab/segment (MVP: same screen, one scroll).

Example layout:

Section title: “Shopping List” (H2).

Each category group:

“Produce”

 Tomatoes

 Onions

“Dairy”

 Mozzarella

“Pantry”

 Olive oil

Each item:

Checkbox

Ingredient name

If user is free and some ingredients are hidden:

Add a note at the bottom:

“Some ingredients are hidden in the free version. Upgrade to ensure you don’t miss anything.”

Optional controls:

Button “Copy list” → copies plain text into clipboard.

Button “Share” → opens native share sheet with text version of list.

4.4 Premium Paywall Modal

Purpose: Show a single clear premium offer when user wants >5 ingredients.

Trigger points:

User taps “Upgrade to Premium” in Results Screen.

(Optionally) Banner at top when >5 ingredients.

Modal Layout:

Type: Full-screen modal with close “X” in top-right.

Background: #FFFFFF.

Content:

Title:

“Get the full ingredient list”

Style: H1, center.

Short description:

“Free version shows up to 5 ingredients per recipe. Premium unlocks all ingredients for every video.”

Style: Body, center, #6B7280.

Feature bullets (3 max):

“See all detected ingredients for every video”

“Never miss a hidden spice or garnish”

“Support future improvements to FoodProcessor”

Price section:

Large price text:

“Premium: €X.XX (one-time or monthly – define during hackathon)”

Small text:

“Handled securely by Lemon Squeezy.”

Primary CTA Button:

Label: “Upgrade now”

Color: primary #22C55E, full width, 48 px high.

On tap: trigger Lemon Squeezy checkout flow (webview or native SDK).

Secondary link:

“Restore purchase” (small text)

For MVP, can be a dummy call or used with Lemon Squeezy API if available.

Fine print:

Small, bottom-aligned text:

“By upgrading you agree to our Terms & Conditions and Privacy Policy.”

“Terms & Conditions” and “Privacy Policy” are tappable, open respective screens.

4.5 Settings & Legal Screen

Accessed from Home screen (gear icon).

Layout:

App bar:

Title: “Settings & Legal”

Content (list of items):

“Account / Premium Status”

Subtitle:

If free: “Current plan: Free — Up to 5 ingredients per recipe.”

If premium: “Current plan: Premium — Unlimited ingredients.”

Optionally include a “Manage Subscription” link (can open Lemon Squeezy self-serve portal or placeholder).

“Restore Purchase”

Button-style row; triggers restore logic or shows “No purchases found”.

“Terms & Conditions”

Navigates to a static scrollable text screen or opens webview with hosted T&C.

“Privacy Policy”

Same as above.

“About”

Simple text:

App name: FoodProcessor

Version: 1.0

Short copy: “FoodProcessor turns cooking videos into shopping lists. Hackathon edition.”

Legal content placement (MVP):

Terms & Conditions and Privacy Policy must be accessible before any purchase.

On first app open, optionally show a modal:

“By using FoodProcessor you agree to our Terms & Conditions and Privacy Policy.”

Two buttons: “View details” (opens docs) and “Accept & continue”.

Persist acceptance in local storage.

5. Free vs Premium Logic (Frontend Perspective)

Store a simple flag in local state / local storage: isPremium.

On app start:

Check stored premium status.

Optionally validate via backend / Lemon Squeezy, if available (for MVP, local is OK).

Key logic:

After ingredient results are fetched:

Let totalIngredients = ingredients.length.

If isPremium === false AND totalIngredients > 5:

Show only ingredients.slice(0, 5) as full cards.

Render the remaining items as blurred/placeholder entries.

Show premium teaser and paywall trigger.

If isPremium === true:

Show all ingredients normally.

No paywall elements.

After successful purchase via Lemon Squeezy:

Set isPremium to true and persist.

Immediately update current Results Screen to show all ingredients (no reload needed if you kept raw data).

6. Error & Edge Cases

Invalid URL:

Show inline error on Home: “This doesn’t look like a YouTube link. Please check and try again.”

Backend extraction error:

On Progress Screen, show error and “Back to Home” button.

No ingredients found:

Results Screen:

Show message: “We couldn’t detect any ingredients in this video.”

Suggest: “Try another video, preferably a cooking or recipe video.”

7. Terms & Conditions and Privacy Policy (Frontend Requirements)

Both must be accessible via:

Settings & Legal screen.

Link on the Premium Paywall.

Optionally from the first-run consent modal.

Implementation:

For MVP, static text screens with scrollable content are sufficient.

Alternatively, open a webview to hosted pages (URL configurable in app).

UI details:

Screen title: “Terms & Conditions” / “Privacy Policy”.

Body: scrollable text area.

Simple “Back” in app bar.

8. Summary for Frontend Team (Key Points)

One main flow:
Home → Process Video → Progress → Results (Ingredients + Shopping List) → Optional Paywall.

Premium difference:
Free: max 5 visible ingredients.
Premium: all ingredients visible.

No video frames / thumbnails:
Only generic icons/emoji and text.

Paywall:
Single Premium plan, triggered when more than 5 ingredients are available for a free user.

Legal:
Terms & Conditions + Privacy Policy screens, accessible from Settings and referenced in the paywall.