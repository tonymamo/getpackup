import CMS from 'netlify-cms-app';

import IndexPagePreview from '@cms/preview-templates/IndexPagePreview';
import AboutPagePreview from '@cms/preview-templates/AboutPagePreview';
import BlogPostPreview from '@cms/preview-templates/BlogPostPreview';
import ContactPagePreview from '@cms/preview-templates/ContactPagePreview';

import withStyledComponentsRendered from '@cms/styleWrapper';

CMS.registerPreviewTemplate('index', withStyledComponentsRendered(IndexPagePreview));
CMS.registerPreviewTemplate('about', withStyledComponentsRendered(AboutPagePreview));
CMS.registerPreviewTemplate('blog', withStyledComponentsRendered(BlogPostPreview));
CMS.registerPreviewTemplate('contact', withStyledComponentsRendered(ContactPagePreview));
