import CMS from 'netlify-cms-app';

import IndexPagePreview from './preview-templates/IndexPagePreview';
import AboutPagePreview from './preview-templates/AboutPagePreview';
import BlogPostPreview from './preview-templates/BlogPostPreview';
import ContactPagePreview from './preview-templates/ContactPagePreview';
import LinksPagePreview from './preview-templates/LinksPagePreview';

import withStyledComponentsRendered from './styleWrapper';

CMS.registerPreviewTemplate('index', withStyledComponentsRendered(IndexPagePreview));
CMS.registerPreviewTemplate('about', withStyledComponentsRendered(AboutPagePreview));
CMS.registerPreviewTemplate('blog', withStyledComponentsRendered(BlogPostPreview));
CMS.registerPreviewTemplate('contact', withStyledComponentsRendered(ContactPagePreview));
CMS.registerPreviewTemplate('links', withStyledComponentsRendered(LinksPagePreview));
