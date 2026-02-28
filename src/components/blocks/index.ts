import HeroBlockComponent from './HeroBlockComponent'
import ArticleBlockComponent from './ArticleBlockComponent'

export const blockComponents = {
  hero: HeroBlockComponent,
  article: ArticleBlockComponent,
} as const

export { HeroBlockComponent, ArticleBlockComponent }
