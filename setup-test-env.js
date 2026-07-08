require('isomorphic-fetch');
require('@testing-library/jest-dom');

// Mirrors the Modal.setAppElement() call in src/components/Layout.tsx, which
// only runs in the browser via Gatsby's wrapPageElement - absent under Jest.
// A detached element (rather than document.body) avoids aria-hiding the
// modal's own content, since react-modal's portal also mounts under body.
require('react-modal').setAppElement(document.createElement('div'));
