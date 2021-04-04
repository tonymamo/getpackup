import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

import IndexPagePreview from './preview-templates/IndexPagePreview';
import AboutPagePreview from './preview-templates/AboutPagePreview';
import BlogPostPreview from './preview-templates/BlogPostPreview';
import ContactPagePreview from './preview-templates/ContactPagePreview';
import LinksPagePreview from './preview-templates/LinksPagePreview';
import PrivacyPagePreview from './preview-templates/PrivacyPagePreview';
import TermsPagePreview from './preview-templates/TermsPagePreview';

import withStyledComponentsRendered from './styleWrapper';

CMS.registerPreviewTemplate('index', withStyledComponentsRendered(IndexPagePreview));
CMS.registerPreviewTemplate('about', withStyledComponentsRendered(AboutPagePreview));
CMS.registerPreviewTemplate('blog', withStyledComponentsRendered(BlogPostPreview));
CMS.registerPreviewTemplate('contact', withStyledComponentsRendered(ContactPagePreview));
CMS.registerPreviewTemplate('links', withStyledComponentsRendered(LinksPagePreview));
CMS.registerPreviewTemplate('privacy', withStyledComponentsRendered(PrivacyPagePreview));
CMS.registerPreviewTemplate('terms', withStyledComponentsRendered(TermsPagePreview));

CMS.registerMediaLibrary(cloudinary);
