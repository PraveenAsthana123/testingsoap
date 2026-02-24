import React, { useState, useCallback, useMemo } from 'react';

// ---------------------------------------------------------------------------
// DATA: All 15 UI Components with their test cases
// ---------------------------------------------------------------------------

const UI_COMPONENTS = [
  {
    id: 'input-box',
    name: 'Input Box (Text Field)',
    icon: '[ ]',
    categories: {
      Positive: [
        { id: 'inp-p1', desc: 'Enter valid text in input field', expected: 'Text appears correctly in the field' },
        { id: 'inp-p2', desc: 'Enter text up to max length', expected: 'Input accepts text up to maxLength attribute value' },
        { id: 'inp-p3', desc: 'Copy-paste text into field', expected: 'Pasted text appears correctly, events fire' },
        { id: 'inp-p4', desc: 'Tab navigation to/from field', expected: 'Focus moves to input on Tab, leaves on next Tab' },
      ],
      Negative: [
        { id: 'inp-n1', desc: 'Enter SQL injection: <script>alert(1)</script>', expected: 'Input sanitized, no script execution' },
        { id: 'inp-n2', desc: 'Submit form with empty required field', expected: 'Validation error shown, form not submitted' },
        { id: 'inp-n3', desc: 'Enter special characters: !@#$%^&*()', expected: 'Characters handled gracefully per field type' },
        { id: 'inp-n4', desc: 'Enter text exceeding maxlength attribute', expected: 'Input truncated or rejected at maxLength boundary' },
      ],
      Functional: [
        { id: 'inp-f1', desc: 'Placeholder text displays when empty', expected: 'Placeholder visible, disappears on input' },
        { id: 'inp-f2', desc: 'Label associated with input via htmlFor', expected: 'Clicking label focuses the input field' },
        { id: 'inp-f3', desc: 'Focus and blur events fire correctly', expected: 'onFocus and onBlur handlers called' },
        { id: 'inp-f4', desc: 'Value binding updates on change', expected: 'State reflects current input value in real-time' },
      ],
      Integration: [
        { id: 'inp-i1', desc: 'Form submission sends input value', expected: 'Server receives correct field value' },
        { id: 'inp-i2', desc: 'API validation errors display below field', expected: 'Error message from API shown under input' },
        { id: 'inp-i3', desc: 'Error clears on valid input re-entry', expected: 'Error message removed when user corrects input' },
      ],
    },
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    icon: '[x]',
    categories: {
      Positive: [
        { id: 'chk-p1', desc: 'Check and uncheck a checkbox', expected: 'Checkbox toggles between checked/unchecked states' },
        { id: 'chk-p2', desc: 'Verify default checked state', expected: 'Checkbox renders as checked when defaultChecked is true' },
        { id: 'chk-p3', desc: 'Toggle checkbox with Space key', expected: 'Pressing Space toggles the checkbox state' },
      ],
      Negative: [
        { id: 'chk-n1', desc: 'Click on disabled checkbox', expected: 'No state change, cursor shows not-allowed' },
        { id: 'chk-n2', desc: 'Rapid toggle 20 times quickly', expected: 'State remains consistent, no UI glitch' },
      ],
      Functional: [
        { id: 'chk-f1', desc: 'onChange event fires on toggle', expected: 'Event handler called with new checked value' },
        { id: 'chk-f2', desc: 'Visual state matches checked value', expected: 'Checkmark visible when checked=true' },
        { id: 'chk-f3', desc: 'Clicking label toggles checkbox', expected: 'Associated label click changes checkbox state' },
      ],
      Integration: [
        { id: 'chk-i1', desc: 'Checkbox group in form submission', expected: 'All checked values included in form data' },
        { id: 'chk-i2', desc: 'Select-all / Deselect-all functionality', expected: 'Master checkbox toggles all child checkboxes' },
        { id: 'chk-i3', desc: 'Filter list by checked checkboxes', expected: 'Data filtered based on selected checkbox values' },
      ],
    },
  },
  {
    id: 'dropdown',
    name: 'Dropdown / Select Box',
    icon: '[v]',
    categories: {
      Positive: [
        { id: 'drp-p1', desc: 'Select an option from dropdown', expected: 'Selected option displayed, value updated' },
        { id: 'drp-p2', desc: 'Verify default selected option', expected: 'Default option shown on initial render' },
        { id: 'drp-p3', desc: 'Navigate options with arrow keys', expected: 'Up/Down arrows move selection highlight' },
      ],
      Negative: [
        { id: 'drp-n1', desc: 'Submit form with no selection (required)', expected: 'Validation error shown for empty selection' },
        { id: 'drp-n2', desc: 'Click on disabled option', expected: 'Option not selectable, no state change' },
        { id: 'drp-n3', desc: 'Option with very long text (200+ chars)', expected: 'Text truncated or wrapped, no layout break' },
      ],
      Functional: [
        { id: 'drp-f1', desc: 'onChange event fires on selection', expected: 'Handler called with selected value' },
        { id: 'drp-f2', desc: 'Selected value displays correctly', expected: 'Display text matches chosen option' },
        { id: 'drp-f3', desc: 'Option count matches data source', expected: 'All options rendered from provided data' },
      ],
      Integration: [
        { id: 'drp-i1', desc: 'Cascading dropdown (country > state > city)', expected: 'Child dropdown updates when parent changes' },
        { id: 'drp-i2', desc: 'API-driven options load on mount', expected: 'Options fetched from API and rendered' },
        { id: 'drp-i3', desc: 'Form submit includes selected value', expected: 'Server receives correct dropdown value' },
      ],
    },
  },
  {
    id: 'radio-button',
    name: 'Radio Button',
    icon: '(o)',
    categories: {
      Positive: [
        { id: 'rad-p1', desc: 'Select one radio in a group', expected: 'Selected radio shows filled state' },
        { id: 'rad-p2', desc: 'Switch selection between radios', expected: 'Previous deselected, new one selected' },
        { id: 'rad-p3', desc: 'Select radio using keyboard', expected: 'Arrow keys move selection within group' },
      ],
      Negative: [
        { id: 'rad-n1', desc: 'Submit form with no radio selected', expected: 'Validation error for required radio group' },
        { id: 'rad-n2', desc: 'Click on disabled radio button', expected: 'No state change, cursor not-allowed' },
      ],
      Functional: [
        { id: 'rad-f1', desc: 'Only one radio selected in group at a time', expected: 'Mutual exclusion enforced within name group' },
        { id: 'rad-f2', desc: 'Label click selects associated radio', expected: 'Clicking label text selects the radio' },
        { id: 'rad-f3', desc: 'Value binding reflects selected option', expected: 'State matches the value of selected radio' },
      ],
      Integration: [
        { id: 'rad-i1', desc: 'Radio shows/hides conditional form sections', expected: 'Selecting option reveals related fields' },
        { id: 'rad-i2', desc: 'Form validation with radio selection', expected: 'Required radio group validated on submit' },
      ],
    },
  },
  {
    id: 'button',
    name: 'Button',
    icon: '[BTN]',
    categories: {
      Positive: [
        { id: 'btn-p1', desc: 'Click button triggers action', expected: 'onClick handler fires, action performed' },
        { id: 'btn-p2', desc: 'Disabled button appearance and behavior', expected: 'Button grayed out, click has no effect' },
        { id: 'btn-p3', desc: 'Loading state shows spinner', expected: 'Button shows loading indicator, disabled during load' },
      ],
      Negative: [
        { id: 'btn-n1', desc: 'Double-click prevention on submit', expected: 'Only one submission triggered, second click ignored' },
        { id: 'btn-n2', desc: 'Rapid clicks (10 clicks in 1 second)', expected: 'Action fires once or debounced appropriately' },
        { id: 'btn-n3', desc: 'Click during loading/async operation', expected: 'Click ignored while operation in progress' },
      ],
      Functional: [
        { id: 'btn-f1', desc: 'onClick handler receives event object', expected: 'Event object passed to handler function' },
        { id: 'btn-f2', desc: 'type=submit triggers form submission', expected: 'Form onSubmit fires when button clicked' },
        { id: 'btn-f3', desc: 'Enter key activates focused button', expected: 'Pressing Enter on focused button triggers click' },
      ],
      Integration: [
        { id: 'btn-i1', desc: 'Button submits form and shows response', expected: 'Form data sent, success/error response displayed' },
        { id: 'btn-i2', desc: 'Button triggers API call with loading', expected: 'API called, loading shown, result rendered' },
        { id: 'btn-i3', desc: 'Navigation button routes to new page', expected: 'Browser navigates to target route' },
      ],
    },
  },
  {
    id: 'label',
    name: 'Label',
    icon: 'Lbl',
    categories: {
      Positive: [
        { id: 'lbl-p1', desc: 'Label text displays correctly', expected: 'Text rendered matching provided content' },
        { id: 'lbl-p2', desc: 'Label associated with input via htmlFor', expected: 'htmlFor matches input id attribute' },
      ],
      Negative: [
        { id: 'lbl-n1', desc: 'Very long label text (500+ chars)', expected: 'Text wraps or truncates without layout break' },
        { id: 'lbl-n2', desc: 'Label with HTML entities (&amp; &lt;)', expected: 'Entities rendered as text, not HTML' },
        { id: 'lbl-n3', desc: 'Label missing for attribute', expected: 'Accessibility audit flags the issue' },
      ],
      Functional: [
        { id: 'lbl-f1', desc: 'Clicking label focuses associated input', expected: 'Input receives focus when label clicked' },
        { id: 'lbl-f2', desc: 'Screen reader reads label for input', expected: 'Assistive tech announces label text' },
      ],
      Integration: [
        { id: 'lbl-i1', desc: 'Labels align correctly in form layout', expected: 'Labels and inputs aligned per design' },
      ],
    },
  },
  {
    id: 'text-alignment',
    name: 'Text Alignment (Left/Right/Center)',
    icon: 'ABC',
    categories: {
      Positive: [
        { id: 'ali-p1', desc: 'Left-aligned paragraph text', expected: 'Text aligns to left edge of container' },
        { id: 'ali-p2', desc: 'Right-aligned numbers in table', expected: 'Numbers align to right for readability' },
        { id: 'ali-p3', desc: 'Center-aligned header text', expected: 'Header text centered within container' },
      ],
      Negative: [
        { id: 'ali-n1', desc: 'RTL text (Arabic/Hebrew) alignment', expected: 'Text direction and alignment correct for RTL' },
        { id: 'ali-n2', desc: 'Mixed LTR/RTL text alignment', expected: 'BiDi algorithm handles mixed text correctly' },
        { id: 'ali-n3', desc: 'Overflow text with different alignments', expected: 'Overflow handled per alignment without layout break' },
      ],
      Functional: [
        { id: 'ali-f1', desc: 'CSS text-align property applied correctly', expected: 'Computed style matches expected alignment' },
        { id: 'ali-f2', desc: 'Responsive alignment changes at breakpoints', expected: 'Alignment adjusts per media queries' },
      ],
      Integration: [
        { id: 'ali-i1', desc: 'Table column alignment consistency', expected: 'All cells in column share alignment' },
        { id: 'ali-i2', desc: 'Form layout alignment (labels + inputs)', expected: 'Form elements aligned per design spec' },
      ],
    },
  },
  {
    id: 'logo-image',
    name: 'Logo / Image',
    icon: 'IMG',
    categories: {
      Positive: [
        { id: 'img-p1', desc: 'Image loads from valid URL', expected: 'Image renders at correct dimensions' },
        { id: 'img-p2', desc: 'Alt text present on image', expected: 'Alt attribute contains descriptive text' },
        { id: 'img-p3', desc: 'Image dimensions match specification', expected: 'Width and height render as expected' },
      ],
      Negative: [
        { id: 'img-n1', desc: 'Broken image URL (404)', expected: 'Fallback/alt text shown, no broken icon' },
        { id: 'img-n2', desc: 'Missing alt attribute on image', expected: 'Accessibility audit flags missing alt' },
        { id: 'img-n3', desc: 'Oversized image (5000x5000px)', expected: 'Image constrained by container, no overflow' },
      ],
      Functional: [
        { id: 'img-f1', desc: 'Lazy loading with loading="lazy"', expected: 'Image loads only when near viewport' },
        { id: 'img-f2', desc: 'Responsive srcset renders correct size', expected: 'Browser selects appropriate image size' },
        { id: 'img-f3', desc: 'Clickable image navigates if wrapped in link', expected: 'Click navigates to target URL' },
      ],
      Integration: [
        { id: 'img-i1', desc: 'Header logo navigates to home page', expected: 'Clicking logo redirects to home route' },
        { id: 'img-i2', desc: 'Avatar upload and display', expected: 'Uploaded image displays as user avatar' },
      ],
    },
  },
  {
    id: 'data-table',
    name: 'Data Table',
    icon: 'TBL',
    categories: {
      Positive: [
        { id: 'tbl-p1', desc: 'Data displays in rows and columns', expected: 'All data rows rendered with correct cell values' },
        { id: 'tbl-p2', desc: 'Column sorting (ascending/descending)', expected: 'Clicking header sorts column data' },
        { id: 'tbl-p3', desc: 'Pagination shows correct page of data', expected: 'Page controls navigate through data pages' },
      ],
      Negative: [
        { id: 'tbl-n1', desc: 'Empty data set (zero rows)', expected: 'Empty state message shown, no errors' },
        { id: 'tbl-n2', desc: 'Large dataset (10,000 rows)', expected: 'Table paginates, no performance degradation' },
        { id: 'tbl-n3', desc: 'Null values in cells', expected: 'Null displayed as dash or empty, no crash' },
        { id: 'tbl-n4', desc: 'Very long cell content (1000+ chars)', expected: 'Cell truncates with ellipsis or wraps' },
      ],
      Functional: [
        { id: 'tbl-f1', desc: 'Column sorting toggles asc/desc', expected: 'Sort indicator changes direction on click' },
        { id: 'tbl-f2', desc: 'Row selection (single/multi)', expected: 'Selected rows highlighted, selection state tracked' },
        { id: 'tbl-f3', desc: 'Filter/search reduces visible rows', expected: 'Only matching rows displayed' },
      ],
      Integration: [
        { id: 'tbl-i1', desc: 'API data loads into table', expected: 'Fetched data populates all columns' },
        { id: 'tbl-i2', desc: 'CRUD operations from table actions', expected: 'Edit/delete actions update data and UI' },
        { id: 'tbl-i3', desc: 'Export table data to CSV', expected: 'Downloaded file contains visible table data' },
      ],
    },
  },
  {
    id: 'modal-dialog',
    name: 'Modal / Dialog',
    icon: '[M]',
    categories: {
      Positive: [
        { id: 'mod-p1', desc: 'Open and close modal', expected: 'Modal appears on trigger, closes on action' },
        { id: 'mod-p2', desc: 'Close modal by clicking overlay', expected: 'Clicking outside modal closes it' },
        { id: 'mod-p3', desc: 'Close modal with ESC key', expected: 'Pressing Escape closes the modal' },
      ],
      Negative: [
        { id: 'mod-n1', desc: 'Nested modals (modal inside modal)', expected: 'Inner modal stacks correctly above outer' },
        { id: 'mod-n2', desc: 'Scroll lock on body when modal open', expected: 'Background page does not scroll' },
        { id: 'mod-n3', desc: 'Focus trap broken by Tab key', expected: 'Focus stays within modal boundaries' },
      ],
      Functional: [
        { id: 'mod-f1', desc: 'Focus trapped inside modal', expected: 'Tab cycles through modal elements only' },
        { id: 'mod-f2', desc: 'Backdrop overlay visible behind modal', expected: 'Semi-transparent backdrop covers page' },
        { id: 'mod-f3', desc: 'Open/close animation plays', expected: 'Fade-in on open, fade-out on close' },
      ],
      Integration: [
        { id: 'mod-i1', desc: 'Confirmation dialog before delete', expected: 'Delete only executes after confirm click' },
        { id: 'mod-i2', desc: 'Form inside modal submits data', expected: 'Modal form data sent to server' },
        { id: 'mod-i3', desc: 'Async action in modal with loading', expected: 'Modal shows loading, then success/error' },
      ],
    },
  },
  {
    id: 'toast-notification',
    name: 'Toast / Notification',
    icon: '[!]',
    categories: {
      Positive: [
        { id: 'tst-p1', desc: 'Show success toast message', expected: 'Green toast appears with message' },
        { id: 'tst-p2', desc: 'Auto-dismiss after duration', expected: 'Toast disappears after configured timeout' },
        { id: 'tst-p3', desc: 'Multiple toasts stack vertically', expected: 'Toasts stack without overlapping' },
      ],
      Negative: [
        { id: 'tst-n1', desc: 'Very long toast message (500+ chars)', expected: 'Toast wraps or truncates, no overflow' },
        { id: 'tst-n2', desc: 'Rapid fire 20 toasts in 1 second', expected: 'Toasts queue or limit max visible' },
      ],
      Functional: [
        { id: 'tst-f1', desc: 'Duration configurable per toast', expected: 'Each toast respects its duration setting' },
        { id: 'tst-f2', desc: 'Dismiss button closes toast', expected: 'X button removes toast immediately' },
        { id: 'tst-f3', desc: 'Types: success, error, warning, info', expected: 'Each type has distinct color and icon' },
      ],
      Integration: [
        { id: 'tst-i1', desc: 'API error triggers error toast', expected: 'Failed API call shows red error toast' },
        { id: 'tst-i2', desc: 'Form success triggers success toast', expected: 'Successful form submit shows green toast' },
        { id: 'tst-i3', desc: 'System alert triggers warning toast', expected: 'System warning displayed as yellow toast' },
      ],
    },
  },
  {
    id: 'accordion',
    name: 'Accordion / Collapsible',
    icon: '[+]',
    categories: {
      Positive: [
        { id: 'acc-p1', desc: 'Expand and collapse section', expected: 'Content shows on expand, hides on collapse' },
        { id: 'acc-p2', desc: 'Multiple sections open simultaneously', expected: 'Each section toggles independently' },
        { id: 'acc-p3', desc: 'Toggle with keyboard (Enter/Space)', expected: 'Keyboard activates accordion header' },
      ],
      Negative: [
        { id: 'acc-n1', desc: 'Accordion with empty content', expected: 'Empty state handled, no layout collapse' },
        { id: 'acc-n2', desc: 'Very long content in section', expected: 'Content scrolls or expands container' },
        { id: 'acc-n3', desc: 'Nested accordions', expected: 'Inner accordion works within outer section' },
      ],
      Functional: [
        { id: 'acc-f1', desc: 'aria-expanded attribute updates', expected: 'true when open, false when closed' },
        { id: 'acc-f2', desc: 'Expand/collapse animation plays', expected: 'Smooth height transition on toggle' },
        { id: 'acc-f3', desc: 'Content height calculated correctly', expected: 'No content clipping or extra whitespace' },
      ],
      Integration: [
        { id: 'acc-i1', desc: 'FAQ section with dynamic content', expected: 'API-loaded FAQs render in accordion' },
        { id: 'acc-i2', desc: 'Settings panel with form controls', expected: 'Forms within accordion sections work correctly' },
      ],
    },
  },
  {
    id: 'tabs',
    name: 'Tabs',
    icon: '[T]',
    categories: {
      Positive: [
        { id: 'tab-p1', desc: 'Switch between tabs', expected: 'Tab content changes on click' },
        { id: 'tab-p2', desc: 'Default active tab renders', expected: 'First or specified tab active on load' },
        { id: 'tab-p3', desc: 'Keyboard navigation (Left/Right arrows)', expected: 'Arrow keys move between tab headers' },
      ],
      Negative: [
        { id: 'tab-n1', desc: 'Many tabs overflow container', expected: 'Tabs scroll or wrap, no layout break' },
        { id: 'tab-n2', desc: 'Tab with empty content panel', expected: 'Empty state shown, no errors' },
      ],
      Functional: [
        { id: 'tab-f1', desc: 'Active tab indicator visible', expected: 'Active tab has distinct visual style' },
        { id: 'tab-f2', desc: 'Content panel switches on tab change', expected: 'Only selected tab content visible' },
        { id: 'tab-f3', desc: 'URL hash syncs with active tab', expected: 'Browser URL updates with tab identifier' },
      ],
      Integration: [
        { id: 'tab-i1', desc: 'Lazy load tab content on first view', expected: 'Data fetched only when tab activated' },
        { id: 'tab-i2', desc: 'Form state persists across tab switches', expected: 'Switching tabs does not reset form data' },
      ],
    },
  },
  {
    id: 'search-filter',
    name: 'Search / Filter',
    icon: '[Q]',
    categories: {
      Positive: [
        { id: 'src-p1', desc: 'Search returns matching results', expected: 'Results list shows matching items' },
        { id: 'src-p2', desc: 'Clear search resets results', expected: 'All items displayed after clearing' },
        { id: 'src-p3', desc: 'Debounced input (300ms delay)', expected: 'Search fires after typing stops, not per keystroke' },
      ],
      Negative: [
        { id: 'src-n1', desc: 'Search with no matching results', expected: 'Empty state "No results found" message' },
        { id: 'src-n2', desc: 'Special characters in search query', expected: 'Characters handled, no errors thrown' },
        { id: 'src-n3', desc: 'Very long search query (500+ chars)', expected: 'Input truncated or handled gracefully' },
        { id: 'src-n4', desc: 'SQL injection in search field', expected: 'Input sanitized, query parameterized' },
      ],
      Functional: [
        { id: 'src-f1', desc: 'Results update as user types', expected: 'Live filtering with each keystroke (debounced)' },
        { id: 'src-f2', desc: 'Search match highlighted in results', expected: 'Matching text highlighted or bolded' },
        { id: 'src-f3', desc: 'Result count displayed', expected: '"Showing X of Y results" visible' },
      ],
      Integration: [
        { id: 'src-i1', desc: 'API-backed search with server query', expected: 'Search request sent to API, results rendered' },
        { id: 'src-i2', desc: 'Combined filter + sort + search', expected: 'All filters work together correctly' },
      ],
    },
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    icon: '[^]',
    categories: {
      Positive: [
        { id: 'upl-p1', desc: 'Select file via file dialog', expected: 'File selected, name displayed' },
        { id: 'upl-p2', desc: 'Drag and drop file onto zone', expected: 'File accepted, drop zone highlights' },
        { id: 'upl-p3', desc: 'Upload multiple files at once', expected: 'All files listed, individual progress shown' },
      ],
      Negative: [
        { id: 'upl-n1', desc: 'Upload oversized file (>100MB)', expected: 'Error message with size limit info' },
        { id: 'upl-n2', desc: 'Upload wrong file type (.exe for image upload)', expected: 'File type rejected with allowed types list' },
        { id: 'upl-n3', desc: 'Upload empty file (0 bytes)', expected: 'Empty file rejected with error message' },
        { id: 'upl-n4', desc: 'Upload potentially malicious file', expected: 'File scanned/rejected, security error shown' },
      ],
      Functional: [
        { id: 'upl-f1', desc: 'Progress bar during upload', expected: 'Progress percentage updates during upload' },
        { id: 'upl-f2', desc: 'File preview before upload', expected: 'Thumbnail/name shown for selected file' },
        { id: 'upl-f3', desc: 'Cancel upload in progress', expected: 'Upload aborted, UI reset to initial state' },
      ],
      Integration: [
        { id: 'upl-i1', desc: 'Server receives uploaded file', expected: 'File stored on server, URL returned' },
        { id: 'upl-i2', desc: 'Server validation error displayed', expected: 'API error message shown to user' },
        { id: 'upl-i3', desc: 'Uploaded file displays in gallery', expected: 'New file appears in file list/gallery' },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// DATA: Accessibility (WCAG 2.1)
// ---------------------------------------------------------------------------

const ACCESSIBILITY_DATA = {
  Perceivable: [
    { id: 'a11y-per1', desc: 'All images have meaningful alt text', expected: 'Screen reader announces image purpose' },
    { id: 'a11y-per2', desc: 'Video/audio has captions or transcripts', expected: 'Captions available for all media content' },
    { id: 'a11y-per3', desc: 'Color contrast ratio meets 4.5:1 (AA)', expected: 'Text readable against background color' },
    { id: 'a11y-per4', desc: 'Text resizable to 200% without loss', expected: 'Content reflows, no horizontal scroll' },
    { id: 'a11y-per5', desc: 'Info not conveyed by color alone', expected: 'Icons, text, or patterns supplement color' },
    { id: 'a11y-per6', desc: 'Content adapts to portrait/landscape', expected: 'No content loss on orientation change' },
  ],
  Operable: [
    { id: 'a11y-ope1', desc: 'All functionality accessible via keyboard', expected: 'Tab, Enter, Space, Arrows navigate all elements' },
    { id: 'a11y-ope2', desc: 'Focus indicator visible on all elements', expected: 'Focused element has visible outline/ring' },
    { id: 'a11y-ope3', desc: 'Skip navigation link present', expected: 'Skip to main content link at top of page' },
    { id: 'a11y-ope4', desc: 'No time limits or user can extend', expected: 'Session timeout warned, extendable' },
    { id: 'a11y-ope5', desc: 'No content flashes more than 3 times/sec', expected: 'Animations respect reduced motion preference' },
    { id: 'a11y-ope6', desc: 'Page has descriptive title', expected: 'Browser title describes page content' },
  ],
  Understandable: [
    { id: 'a11y-und1', desc: 'HTML lang attribute set on <html>', expected: 'Language declared for screen readers' },
    { id: 'a11y-und2', desc: 'Navigation consistent across pages', expected: 'Nav items in same order on all pages' },
    { id: 'a11y-und3', desc: 'All form inputs have visible labels', expected: 'Labels programmatically associated via htmlFor' },
    { id: 'a11y-und4', desc: 'Error identification on form fields', expected: 'Error messages describe the problem and fix' },
    { id: 'a11y-und5', desc: 'Instructions do not rely on sensory cues', expected: 'Avoid "click the red button" instructions' },
  ],
  Robust: [
    { id: 'a11y-rob1', desc: 'HTML validates without errors', expected: 'W3C validator passes with no critical errors' },
    { id: 'a11y-rob2', desc: 'ARIA roles used correctly', expected: 'Roles, states, properties per WAI-ARIA spec' },
    { id: 'a11y-rob3', desc: 'Custom widgets have ARIA attributes', expected: 'role, aria-label, aria-expanded etc. present' },
    { id: 'a11y-rob4', desc: 'Screen reader compatible (NVDA/VoiceOver)', expected: 'All content announced correctly' },
    { id: 'a11y-rob5', desc: 'Status messages use aria-live regions', expected: 'Dynamic updates announced to screen reader' },
  ],
};

// ---------------------------------------------------------------------------
// DATA: Cross-Browser
// ---------------------------------------------------------------------------

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge'];

const CROSS_BROWSER_COMPONENTS = UI_COMPONENTS.map((c) => ({
  id: c.id,
  name: c.name,
}));

// ---------------------------------------------------------------------------
// DATA: Responsive Testing
// ---------------------------------------------------------------------------

const BREAKPOINTS = [
  { name: 'Mobile', width: '320px' },
  { name: 'Tablet', width: '768px' },
  { name: 'Desktop', width: '1024px' },
  { name: 'Large', width: '1440px' },
];

const RESPONSIVE_CHECKS = [
  { id: 'resp-layout', desc: 'Layout check - columns, grid, flexbox behavior' },
  { id: 'resp-fonts', desc: 'Font sizes - readable, scales appropriately' },
  { id: 'resp-touch', desc: 'Touch targets - minimum 44x44px tap area' },
  { id: 'resp-images', desc: 'Image scaling - responsive, no overflow' },
  { id: 'resp-nav', desc: 'Navigation - hamburger menu on mobile, full on desktop' },
  { id: 'resp-scroll', desc: 'No horizontal scroll at any breakpoint' },
  { id: 'resp-forms', desc: 'Form elements usable at all sizes' },
  { id: 'resp-modals', desc: 'Modals/dialogs fit within viewport' },
];

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------

const styles = {
  page: {
    background: '#ffffff',
    minHeight: '100vh',
    padding: '24px 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#1a1a2e',
    maxWidth: '1440px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
  },
  overallScoreBar: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px 28px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  overallScoreLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  overallProgressTrack: {
    flex: '1',
    minWidth: '200px',
    height: '14px',
    background: '#e2e8f0',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: '7px',
    transition: 'width 0.3s ease',
  },
  overallScoreText: {
    fontSize: '18px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  overallStatsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  statBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  tabContainer: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 24px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
  },
  componentCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '20px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  cardHeader: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    background: '#fafbfc',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  componentIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#3b82f6',
    fontFamily: 'monospace',
    flexShrink: '0',
  },
  componentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  componentMiniScore: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
  },
  cardScoreArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  miniProgressTrack: {
    width: '100px',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  expandArrow: {
    fontSize: '12px',
    color: '#94a3b8',
    transition: 'transform 0.2s ease',
  },
  cardBody: {
    padding: '0',
  },
  demoSection: {
    padding: '16px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  demoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
    marginBottom: '10px',
  },
  demoBox: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  categorySection: {
    padding: '12px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  categoryName: {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  categoryScore: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
  },
  testRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #f8fafc',
  },
  testInfo: {
    flex: '1',
  },
  testDesc: {
    fontSize: '13px',
    color: '#334155',
    lineHeight: '1.4',
  },
  testExpected: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px',
    lineHeight: '1.3',
  },
  toggleBtn: {
    border: 'none',
    borderRadius: '6px',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
    minWidth: '54px',
    textAlign: 'center',
  },
  togglePass: {
    background: '#dcfce7',
    color: '#16a34a',
  },
  toggleFail: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  toggleUntested: {
    background: '#f1f5f9',
    color: '#94a3b8',
  },
  // Accessibility tab
  a11yCategoryCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  a11yCategoryHeader: {
    padding: '14px 20px',
    background: '#fafbfc',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  a11yCategoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  a11yBody: {
    padding: '12px 20px',
  },
  // Cross-browser tab
  browserTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  browserTh: {
    padding: '10px 12px',
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  browserTd: {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  browserStatusBtn: {
    border: 'none',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minWidth: '60px',
    textAlign: 'center',
  },
  // Responsive tab
  breakpointCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  breakpointHeader: {
    padding: '14px 20px',
    background: '#fafbfc',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakpointName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  breakpointWidth: {
    fontSize: '13px',
    color: '#64748b',
    fontFamily: 'monospace',
    background: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  breakpointBody: {
    padding: '12px 20px',
  },
  resetBtn: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#ffffff',
    color: '#64748b',
    transition: 'all 0.15s ease',
  },
};

// ---------------------------------------------------------------------------
// CATEGORY COLORS
// ---------------------------------------------------------------------------

const CATEGORY_COLORS = {
  Positive: { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Negative: { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  Functional: { text: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  Integration: { text: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function getProgressColor(pct) {
  if (pct === 0) return '#e2e8f0';
  if (pct < 30) return '#ef4444';
  if (pct < 60) return '#f59e0b';
  if (pct < 80) return '#3b82f6';
  return '#22c55e';
}

function getAllTestIds(component) {
  const ids = [];
  Object.values(component.categories).forEach((tests) => {
    tests.forEach((t) => ids.push(t.id));
  });
  return ids;
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function ComponentDemo({ componentId }) {
  const [demoInput, setDemoInput] = useState('');
  const [demoChecked, setDemoChecked] = useState(false);
  const [demoSelect, setDemoSelect] = useState('');
  const [demoRadio, setDemoRadio] = useState('');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoAccordionOpen, setDemoAccordionOpen] = useState(false);
  const [demoToastVisible, setDemoToastVisible] = useState(false);
  const [demoSearchTerm, setDemoSearchTerm] = useState('');

  switch (componentId) {
    case 'input-box':
      return (
        <div style={styles.demoBox}>
          <label htmlFor="demo-input" style={{ fontSize: '13px', color: '#475569' }}>Name:</label>
          <input
            id="demo-input"
            type="text"
            placeholder="Enter your name..."
            maxLength={50}
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '200px' }}
          />
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{demoInput.length}/50</span>
        </div>
      );
    case 'checkbox':
      return (
        <div style={styles.demoBox}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
            <input type="checkbox" checked={demoChecked} onChange={(e) => setDemoChecked(e.target.checked)} />
            Accept Terms
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8', cursor: 'not-allowed' }}>
            <input type="checkbox" disabled /> Disabled option
          </label>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Checked: {demoChecked ? 'Yes' : 'No'}</span>
        </div>
      );
    case 'dropdown':
      return (
        <div style={styles.demoBox}>
          <label htmlFor="demo-select" style={{ fontSize: '13px', color: '#475569' }}>Country:</label>
          <select
            id="demo-select"
            value={demoSelect}
            onChange={(e) => setDemoSelect(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
          >
            <option value="">-- Select --</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="in">India</option>
            <option value="de">Germany</option>
          </select>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Selected: {demoSelect || 'None'}</span>
        </div>
      );
    case 'radio-button':
      return (
        <div style={styles.demoBox}>
          {['Male', 'Female', 'Other'].map((opt) => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
              <input type="radio" name="demo-gender" value={opt.toLowerCase()} checked={demoRadio === opt.toLowerCase()} onChange={(e) => setDemoRadio(e.target.value)} />
              {opt}
            </label>
          ))}
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Selected: {demoRadio || 'None'}</span>
        </div>
      );
    case 'button':
      return (
        <div style={styles.demoBox}>
          <button style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Primary</button>
          <button style={{ padding: '6px 16px', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Secondary</button>
          <button disabled style={{ padding: '6px 16px', background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'not-allowed', fontWeight: '600' }}>Disabled</button>
          <button style={{ padding: '6px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Danger</button>
        </div>
      );
    case 'label':
      return (
        <div style={styles.demoBox}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="demo-label-input" style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
            <input id="demo-label-input" type="email" placeholder="user@example.com" style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '200px' }} />
          </div>
        </div>
      );
    case 'text-alignment':
      return (
        <div style={{ ...styles.demoBox, flexDirection: 'column', alignItems: 'stretch' }}>
          <p style={{ textAlign: 'left', margin: '4px 0', fontSize: '13px', color: '#334155' }}>Left-aligned paragraph text for body content.</p>
          <p style={{ textAlign: 'center', margin: '4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>Center-Aligned Heading</p>
          <p style={{ textAlign: 'right', margin: '4px 0', fontSize: '13px', color: '#334155', fontFamily: 'monospace' }}>$1,234.56 (right-aligned)</p>
        </div>
      );
    case 'logo-image':
      return (
        <div style={styles.demoBox}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px' }}>L</div>
          <div style={{ width: '80px', height: '48px', border: '1px dashed #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>Broken img</div>
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%2322c55e' rx='8'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='white' font-size='20' font-weight='bold' dy='.1em'%3E%E2%9C%93%3C/text%3E%3C/svg%3E" alt="Valid logo with checkmark" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
        </div>
      );
    case 'data-table':
      return (
        <div style={{ ...styles.demoBox, flexDirection: 'column', alignItems: 'stretch', padding: '0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: '600', color: '#475569' }}>ID</th>
                <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Name</th>
                <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Status</th>
                <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '600', color: '#475569' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Alice', status: 'Active', score: 95 },
                { id: 2, name: 'Bob', status: 'Inactive', score: 72 },
                { id: 3, name: 'Charlie', status: 'Active', score: 88 },
              ].map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9' }}>{row.id}</td>
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9' }}>{row.name}</td>
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', background: row.status === 'Active' ? '#dcfce7' : '#fee2e2', color: row.status === 'Active' ? '#16a34a' : '#dc2626' }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontFamily: 'monospace' }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'modal-dialog':
      return (
        <div style={styles.demoBox}>
          <button
            onClick={() => setDemoModalOpen(true)}
            style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
          >
            Open Modal
          </button>
          {demoModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setDemoModalOpen(false)}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '360px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>Sample Modal</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>This is a demo modal dialog. Click overlay or button to close.</p>
                <button onClick={() => setDemoModalOpen(false)} style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
              </div>
            </div>
          )}
        </div>
      );
    case 'toast-notification':
      return (
        <div style={styles.demoBox}>
          <button
            onClick={() => { setDemoToastVisible(true); setTimeout(() => setDemoToastVisible(false), 3000); }}
            style={{ padding: '6px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
          >
            Show Toast
          </button>
          {demoToastVisible && (
            <div style={{ padding: '8px 16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Success! Operation completed.
              <button onClick={() => setDemoToastVisible(false)} style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>x</button>
            </div>
          )}
        </div>
      );
    case 'accordion':
      return (
        <div style={{ ...styles.demoBox, flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              onClick={() => setDemoAccordionOpen(!demoAccordionOpen)}
              style={{ padding: '10px 14px', background: '#f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600', color: '#334155' }}
            >
              <span>What is Frontend Testing?</span>
              <span style={{ transform: demoAccordionOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>&#9660;</span>
            </div>
            {demoAccordionOpen && (
              <div style={{ padding: '10px 14px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
                Frontend testing validates UI components, user interactions, accessibility, cross-browser compatibility, and responsive behavior.
              </div>
            )}
          </div>
        </div>
      );
    case 'tabs':
      return (
        <div style={{ ...styles.demoBox, flexDirection: 'column', alignItems: 'stretch' }}>
          <DemoTabs />
        </div>
      );
    case 'search-filter':
      return (
        <div style={styles.demoBox}>
          <input
            type="text"
            placeholder="Search items..."
            value={demoSearchTerm}
            onChange={(e) => setDemoSearchTerm(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '180px' }}
          />
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'].filter((f) => f.toLowerCase().includes(demoSearchTerm.toLowerCase())).length} results
          </span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
              .filter((f) => f.toLowerCase().includes(demoSearchTerm.toLowerCase()))
              .map((f) => (
                <span key={f} style={{ padding: '2px 8px', background: '#eff6ff', borderRadius: '4px', fontSize: '11px', color: '#3b82f6' }}>{f}</span>
              ))}
          </div>
        </div>
      );
    case 'file-upload':
      return (
        <div style={styles.demoBox}>
          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '16px 24px', textAlign: 'center', flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px', color: '#94a3b8' }}>&#8593;</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Drag files here or <span style={{ color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}>browse</span></div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>PNG, JPG, PDF up to 10MB</div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function DemoTabs() {
  const [active, setActive] = useState(0);
  const tabLabels = ['Overview', 'Details', 'Settings'];
  return (
    <>
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
        {tabLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: active === i ? '2px solid #3b82f6' : '2px solid transparent',
              marginBottom: '-2px',
              color: active === i ? '#3b82f6' : '#64748b',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 0', fontSize: '12px', color: '#64748b' }}>
        {active === 0 && 'This is the Overview tab content.'}
        {active === 1 && 'Detailed information goes here.'}
        {active === 2 && 'Application settings and preferences.'}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function FrontendTesting() {
  const [activeTab, setActiveTab] = useState('ui-components');
  const [expandedCards, setExpandedCards] = useState({});

  // Test results: { testId: 'pass' | 'fail' | null }
  const [results, setResults] = useState({});

  // Cross-browser results: { `${componentId}-${browser}`: 'pass' | 'fail' | 'partial' | null }
  const [browserResults, setBrowserResults] = useState({});

  // Responsive results: { `${breakpoint}-${checkId}`: 'pass' | 'fail' | null }
  const [responsiveResults, setResponsiveResults] = useState({});

  // Toggle test result
  const toggleResult = useCallback((testId) => {
    setResults((prev) => {
      const current = prev[testId];
      if (!current) return { ...prev, [testId]: 'pass' };
      if (current === 'pass') return { ...prev, [testId]: 'fail' };
      const next = { ...prev };
      delete next[testId];
      return next;
    });
  }, []);

  // Toggle browser result
  const toggleBrowserResult = useCallback((key) => {
    setBrowserResults((prev) => {
      const current = prev[key];
      if (!current) return { ...prev, [key]: 'pass' };
      if (current === 'pass') return { ...prev, [key]: 'fail' };
      if (current === 'fail') return { ...prev, [key]: 'partial' };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Toggle responsive result
  const toggleResponsiveResult = useCallback((key) => {
    setResponsiveResults((prev) => {
      const current = prev[key];
      if (!current) return { ...prev, [key]: 'pass' };
      if (current === 'pass') return { ...prev, [key]: 'fail' };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Toggle card expand
  const toggleCard = useCallback((cardId) => {
    setExpandedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  }, []);

  // Reset all results
  const resetAll = useCallback(() => {
    setResults({});
    setBrowserResults({});
    setResponsiveResults({});
  }, []);

  // ---------- COMPUTE SCORES ----------

  // UI Component scores
  const componentScores = useMemo(() => {
    return UI_COMPONENTS.map((comp) => {
      const allIds = getAllTestIds(comp);
      const total = allIds.length;
      const passed = allIds.filter((id) => results[id] === 'pass').length;
      const failed = allIds.filter((id) => results[id] === 'fail').length;
      return { id: comp.id, total, passed, failed, tested: passed + failed };
    });
  }, [results]);

  // A11y scores
  const a11yScores = useMemo(() => {
    const scores = {};
    Object.entries(ACCESSIBILITY_DATA).forEach(([cat, tests]) => {
      const total = tests.length;
      const passed = tests.filter((t) => results[t.id] === 'pass').length;
      const failed = tests.filter((t) => results[t.id] === 'fail').length;
      scores[cat] = { total, passed, failed };
    });
    return scores;
  }, [results]);

  // Browser scores
  const browserScore = useMemo(() => {
    const total = CROSS_BROWSER_COMPONENTS.length * BROWSERS.length;
    const passed = Object.values(browserResults).filter((v) => v === 'pass').length;
    const failed = Object.values(browserResults).filter((v) => v === 'fail').length;
    const partial = Object.values(browserResults).filter((v) => v === 'partial').length;
    return { total, passed, failed, partial, tested: passed + failed + partial };
  }, [browserResults]);

  // Responsive scores
  const responsiveScore = useMemo(() => {
    const total = BREAKPOINTS.length * RESPONSIVE_CHECKS.length;
    const passed = Object.values(responsiveResults).filter((v) => v === 'pass').length;
    const failed = Object.values(responsiveResults).filter((v) => v === 'fail').length;
    return { total, passed, failed, tested: passed + failed };
  }, [responsiveResults]);

  // Overall score (all tabs combined)
  const overallScore = useMemo(() => {
    // UI tests
    const uiTotal = UI_COMPONENTS.reduce((sum, c) => sum + getAllTestIds(c).length, 0);
    const uiPassed = Object.entries(results).filter(([k, v]) => v === 'pass' && UI_COMPONENTS.some((c) => getAllTestIds(c).includes(k))).length;

    // A11y tests
    const a11yTotal = Object.values(ACCESSIBILITY_DATA).reduce((sum, tests) => sum + tests.length, 0);
    const a11yPassed = Object.values(ACCESSIBILITY_DATA).flatMap((tests) => tests).filter((t) => results[t.id] === 'pass').length;

    const total = uiTotal + a11yTotal + browserScore.total + responsiveScore.total;
    const passed = uiPassed + a11yPassed + browserScore.passed + responsiveScore.passed;
    const failed =
      Object.entries(results).filter(([, v]) => v === 'fail').length +
      browserScore.failed +
      responsiveScore.failed;

    return { total, passed, failed };
  }, [results, browserScore, responsiveScore]);

  const overallPct = overallScore.total > 0 ? Math.round((overallScore.passed / overallScore.total) * 100) : 0;

  // ---------- TABS CONFIG ----------

  const TABS = [
    { id: 'ui-components', label: 'UI Components' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'cross-browser', label: 'Cross-Browser' },
    { id: 'responsive', label: 'Responsive Testing' },
  ];

  // ---------- RENDER ----------

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Frontend UI Testing</h1>
        <p style={styles.subtitle}>
          Comprehensive testing dashboard covering 15 UI components with positive, negative, functional, and integration test cases. Track test execution across accessibility, cross-browser, and responsive dimensions.
        </p>
      </div>

      {/* Overall Score Bar */}
      <div style={styles.overallScoreBar}>
        <span style={styles.overallScoreLabel}>Overall Progress</span>
        <div style={styles.overallProgressTrack}>
          <div
            style={{
              ...styles.overallProgressFill,
              width: `${overallPct}%`,
              background: getProgressColor(overallPct),
            }}
          />
        </div>
        <span style={{ ...styles.overallScoreText, color: getProgressColor(overallPct) }}>
          {overallScore.passed}/{overallScore.total} ({overallPct}%)
        </span>
        <div style={styles.overallStatsRow}>
          <span style={{ ...styles.statBadge, background: '#dcfce7', color: '#16a34a' }}>
            Passed: {overallScore.passed}
          </span>
          <span style={{ ...styles.statBadge, background: '#fee2e2', color: '#dc2626' }}>
            Failed: {overallScore.failed}
          </span>
          <span style={{ ...styles.statBadge, background: '#f1f5f9', color: '#64748b' }}>
            Untested: {overallScore.total - overallScore.passed - overallScore.failed}
          </span>
        </div>
        <button onClick={resetAll} style={styles.resetBtn} title="Reset all test results">
          Reset All
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'ui-components' && (
        <UIComponentsTab
          results={results}
          toggleResult={toggleResult}
          componentScores={componentScores}
          expandedCards={expandedCards}
          toggleCard={toggleCard}
        />
      )}
      {activeTab === 'accessibility' && (
        <AccessibilityTab
          results={results}
          toggleResult={toggleResult}
          a11yScores={a11yScores}
        />
      )}
      {activeTab === 'cross-browser' && (
        <CrossBrowserTab
          browserResults={browserResults}
          toggleBrowserResult={toggleBrowserResult}
          browserScore={browserScore}
        />
      )}
      {activeTab === 'responsive' && (
        <ResponsiveTab
          responsiveResults={responsiveResults}
          toggleResponsiveResult={toggleResponsiveResult}
          responsiveScore={responsiveScore}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 1: UI Components
// ---------------------------------------------------------------------------

function UIComponentsTab({ results, toggleResult, componentScores, expandedCards, toggleCard }) {
  return (
    <div>
      {UI_COMPONENTS.map((comp, idx) => {
        const score = componentScores[idx];
        const pct = score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0;
        const isExpanded = expandedCards[comp.id] !== false; // default expanded for first 3
        const defaultExpand = idx < 3 && expandedCards[comp.id] === undefined;
        const showBody = isExpanded || defaultExpand;

        return (
          <div key={comp.id} style={styles.componentCard}>
            {/* Card Header */}
            <div
              style={styles.cardHeader}
              onClick={() => toggleCard(comp.id)}
            >
              <div style={styles.cardHeaderLeft}>
                <div style={styles.componentIcon}>{comp.icon}</div>
                <div>
                  <div style={styles.componentName}>{idx + 1}. {comp.name}</div>
                  <div style={styles.componentMiniScore}>
                    {score.passed}/{score.total} passed
                    {score.failed > 0 && <span style={{ color: '#ef4444', marginLeft: '8px' }}>{score.failed} failed</span>}
                  </div>
                </div>
              </div>
              <div style={styles.cardScoreArea}>
                <div style={styles.miniProgressTrack}>
                  <div style={{ ...styles.miniProgressFill, width: `${pct}%`, background: getProgressColor(pct) }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: getProgressColor(pct), minWidth: '38px', textAlign: 'right' }}>
                  {pct}%
                </span>
                <span style={{ ...styles.expandArrow, transform: showBody ? 'rotate(180deg)' : 'rotate(0)' }}>
                  &#9660;
                </span>
              </div>
            </div>

            {/* Card Body */}
            {showBody && (
              <div style={styles.cardBody}>
                {/* Visual Demo */}
                <div style={styles.demoSection}>
                  <div style={styles.demoLabel}>Live Component Example</div>
                  <ComponentDemo componentId={comp.id} />
                </div>

                {/* Test Categories */}
                {Object.entries(comp.categories).map(([catName, tests]) => {
                  const catColor = CATEGORY_COLORS[catName] || CATEGORY_COLORS.Functional;
                  const catPassed = tests.filter((t) => results[t.id] === 'pass').length;
                  return (
                    <div key={catName} style={styles.categorySection}>
                      <div style={styles.categoryHeader}>
                        <span style={{ ...styles.categoryName, color: catColor.text }}>
                          {catName}
                        </span>
                        <span style={styles.categoryScore}>
                          {catPassed}/{tests.length}
                        </span>
                      </div>
                      {tests.map((test) => {
                        const status = results[test.id]; // 'pass' | 'fail' | undefined
                        let btnStyle = { ...styles.toggleBtn, ...styles.toggleUntested };
                        let btnText = 'Untested';
                        if (status === 'pass') {
                          btnStyle = { ...styles.toggleBtn, ...styles.togglePass };
                          btnText = 'PASS';
                        } else if (status === 'fail') {
                          btnStyle = { ...styles.toggleBtn, ...styles.toggleFail };
                          btnText = 'FAIL';
                        }
                        return (
                          <div key={test.id} style={styles.testRow}>
                            <div style={styles.testInfo}>
                              <div style={styles.testDesc}>{test.desc}</div>
                              <div style={styles.testExpected}>Expected: {test.expected}</div>
                            </div>
                            <button onClick={() => toggleResult(test.id)} style={btnStyle}>
                              {btnText}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 2: Accessibility
// ---------------------------------------------------------------------------

function AccessibilityTab({ results, toggleResult, a11yScores }) {
  const totalAll = Object.values(a11yScores).reduce((s, c) => s + c.total, 0);
  const passedAll = Object.values(a11yScores).reduce((s, c) => s + c.passed, 0);
  const pctAll = totalAll > 0 ? Math.round((passedAll / totalAll) * 100) : 0;

  return (
    <div>
      {/* Summary bar */}
      <div style={{ ...styles.overallScoreBar, marginBottom: '20px' }}>
        <span style={styles.overallScoreLabel}>WCAG 2.1 Compliance</span>
        <div style={styles.overallProgressTrack}>
          <div style={{ ...styles.overallProgressFill, width: `${pctAll}%`, background: getProgressColor(pctAll) }} />
        </div>
        <span style={{ ...styles.overallScoreText, color: getProgressColor(pctAll) }}>
          {passedAll}/{totalAll} ({pctAll}%)
        </span>
      </div>

      {Object.entries(ACCESSIBILITY_DATA).map(([catName, tests]) => {
        const score = a11yScores[catName];
        const pct = score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0;

        return (
          <div key={catName} style={styles.a11yCategoryCard}>
            <div style={styles.a11yCategoryHeader}>
              <div>
                <div style={styles.a11yCategoryName}>{catName}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {score.passed}/{score.total} checks passed
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ ...styles.miniProgressTrack, width: '120px' }}>
                  <div style={{ ...styles.miniProgressFill, width: `${pct}%`, background: getProgressColor(pct) }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: getProgressColor(pct) }}>{pct}%</span>
              </div>
            </div>
            <div style={styles.a11yBody}>
              {tests.map((test) => {
                const status = results[test.id];
                let btnStyle = { ...styles.toggleBtn, ...styles.toggleUntested };
                let btnText = 'Untested';
                if (status === 'pass') {
                  btnStyle = { ...styles.toggleBtn, ...styles.togglePass };
                  btnText = 'PASS';
                } else if (status === 'fail') {
                  btnStyle = { ...styles.toggleBtn, ...styles.toggleFail };
                  btnText = 'FAIL';
                }
                return (
                  <div key={test.id} style={styles.testRow}>
                    <div style={styles.testInfo}>
                      <div style={styles.testDesc}>{test.desc}</div>
                      <div style={styles.testExpected}>Expected: {test.expected}</div>
                    </div>
                    <button onClick={() => toggleResult(test.id)} style={btnStyle}>
                      {btnText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 3: Cross-Browser
// ---------------------------------------------------------------------------

function CrossBrowserTab({ browserResults, toggleBrowserResult, browserScore }) {
  const pct = browserScore.total > 0 ? Math.round((browserScore.passed / browserScore.total) * 100) : 0;

  function getBrowserBtnStyle(status) {
    if (status === 'pass') return { ...styles.browserStatusBtn, background: '#dcfce7', color: '#16a34a' };
    if (status === 'fail') return { ...styles.browserStatusBtn, background: '#fee2e2', color: '#dc2626' };
    if (status === 'partial') return { ...styles.browserStatusBtn, background: '#fef9c3', color: '#a16207' };
    return { ...styles.browserStatusBtn, background: '#f1f5f9', color: '#94a3b8' };
  }

  function getBrowserBtnText(status) {
    if (status === 'pass') return 'Pass';
    if (status === 'fail') return 'Fail';
    if (status === 'partial') return 'Partial';
    return 'Untested';
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ ...styles.overallScoreBar, marginBottom: '20px' }}>
        <span style={styles.overallScoreLabel}>Browser Compatibility</span>
        <div style={styles.overallProgressTrack}>
          <div style={{ ...styles.overallProgressFill, width: `${pct}%`, background: getProgressColor(pct) }} />
        </div>
        <span style={{ ...styles.overallScoreText, color: getProgressColor(pct) }}>
          {browserScore.passed}/{browserScore.total} ({pct}%)
        </span>
        <div style={styles.overallStatsRow}>
          <span style={{ ...styles.statBadge, background: '#dcfce7', color: '#16a34a' }}>Pass: {browserScore.passed}</span>
          <span style={{ ...styles.statBadge, background: '#fee2e2', color: '#dc2626' }}>Fail: {browserScore.failed}</span>
          <span style={{ ...styles.statBadge, background: '#fef9c3', color: '#a16207' }}>Partial: {browserScore.partial}</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'auto' }}>
        <table style={styles.browserTable}>
          <thead>
            <tr>
              <th style={{ ...styles.browserTh, minWidth: '200px' }}>UI Component</th>
              {BROWSERS.map((b) => (
                <th key={b} style={{ ...styles.browserTh, textAlign: 'center', minWidth: '100px' }}>{b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CROSS_BROWSER_COMPONENTS.map((comp, idx) => (
              <tr key={comp.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#fafbfc' }}>
                <td style={styles.browserTd}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{comp.name}</span>
                </td>
                {BROWSERS.map((browser) => {
                  const key = `${comp.id}-${browser}`;
                  const status = browserResults[key] || null;
                  return (
                    <td key={key} style={{ ...styles.browserTd, textAlign: 'center' }}>
                      <button
                        onClick={() => toggleBrowserResult(key)}
                        style={getBrowserBtnStyle(status)}
                      >
                        {getBrowserBtnText(status)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '20px', fontSize: '12px', color: '#64748b' }}>
        <span>Click status buttons to cycle: <strong>Untested</strong> &rarr; <strong style={{ color: '#16a34a' }}>Pass</strong> &rarr; <strong style={{ color: '#dc2626' }}>Fail</strong> &rarr; <strong style={{ color: '#a16207' }}>Partial</strong> &rarr; Untested</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 4: Responsive Testing
// ---------------------------------------------------------------------------

function ResponsiveTab({ responsiveResults, toggleResponsiveResult, responsiveScore }) {
  const pct = responsiveScore.total > 0 ? Math.round((responsiveScore.passed / responsiveScore.total) * 100) : 0;

  return (
    <div>
      {/* Summary */}
      <div style={{ ...styles.overallScoreBar, marginBottom: '20px' }}>
        <span style={styles.overallScoreLabel}>Responsive Testing</span>
        <div style={styles.overallProgressTrack}>
          <div style={{ ...styles.overallProgressFill, width: `${pct}%`, background: getProgressColor(pct) }} />
        </div>
        <span style={{ ...styles.overallScoreText, color: getProgressColor(pct) }}>
          {responsiveScore.passed}/{responsiveScore.total} ({pct}%)
        </span>
      </div>

      {BREAKPOINTS.map((bp) => {
        const bpTests = RESPONSIVE_CHECKS.map((c) => ({
          ...c,
          key: `${bp.name}-${c.id}`,
        }));
        const bpPassed = bpTests.filter((t) => responsiveResults[t.key] === 'pass').length;
        const bpTotal = bpTests.length;
        const bpPct = bpTotal > 0 ? Math.round((bpPassed / bpTotal) * 100) : 0;

        return (
          <div key={bp.name} style={styles.breakpointCard}>
            <div style={styles.breakpointHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={styles.breakpointName}>{bp.name}</span>
                <span style={styles.breakpointWidth}>{bp.width}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{bpPassed}/{bpTotal}</span>
                <div style={{ ...styles.miniProgressTrack, width: '100px' }}>
                  <div style={{ ...styles.miniProgressFill, width: `${bpPct}%`, background: getProgressColor(bpPct) }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: getProgressColor(bpPct) }}>{bpPct}%</span>
              </div>
            </div>
            <div style={styles.breakpointBody}>
              {bpTests.map((test) => {
                const status = responsiveResults[test.key];
                let btnStyle = { ...styles.toggleBtn, ...styles.toggleUntested };
                let btnText = 'Untested';
                if (status === 'pass') {
                  btnStyle = { ...styles.toggleBtn, ...styles.togglePass };
                  btnText = 'PASS';
                } else if (status === 'fail') {
                  btnStyle = { ...styles.toggleBtn, ...styles.toggleFail };
                  btnText = 'FAIL';
                }
                return (
                  <div key={test.key} style={styles.testRow}>
                    <div style={styles.testInfo}>
                      <div style={styles.testDesc}>{test.desc}</div>
                    </div>
                    <button onClick={() => toggleResponsiveResult(test.key)} style={btnStyle}>
                      {btnText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
        Click status buttons to cycle: <strong>Untested</strong> &rarr; <strong style={{ color: '#16a34a' }}>Pass</strong> &rarr; <strong style={{ color: '#dc2626' }}>Fail</strong> &rarr; Untested
      </div>
    </div>
  );
}
