import { FluidImageType } from '@common/image';

export type BlogRollType = Array<{
  node: {
    excerpt: string;
    featuredimage: FluidImageType;
    fields: {
      readingTime: {
        text: string;
      };
      slug: string;
    };
    frontmatter: {
      date: string;
      description: string;
      featuredpost: boolean;
      title: string;
    };
  };
}>;
