'use client'

interface ArticleBlockProps {
  title: string
  content: any
  image: {
    id: string
    filename: string
    alt?: string
  }
  imagePosition?: 'left' | 'right'
  cta?: {
    text: string
    url: string
  }
}

export default function ArticleBlockComponent({
  title,
  content,
  image,
  imagePosition = 'right',
  cta,
}: ArticleBlockProps) {
  const imageUrl = `/media/${image.filename}`

  const contentSection = (
    <div>
      <h2 className="text-4xl font-bold uppercase mb-6 tracking-wider" style={{ fontFamily: "'Bebas Neue', cursive" }}>
        {title}
      </h2>
      <div className="text-base leading-relaxed text-gray-700 mb-8">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      {cta && (
        <a
          href={cta.url}
          className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-2xl uppercase tracking-wider text-sm"
        >
          {cta.text}
        </a>
      )}
    </div>
  )

  const imageSection = (
    <div className="w-full rounded overflow-hidden shadow-2xl">
      <img src={imageUrl} alt={image.alt || title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
    </div>
  )

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className={`max-w-5xl mx-auto grid gap-12 items-center ${imagePosition === 'left' ? 'grid-cols-2' : 'grid-cols-2'} md:grid-cols-1`}>
        {imagePosition === 'left' ? (
          <>
            {imageSection}
            {contentSection}
          </>
        ) : (
          <>
            {contentSection}
            {imageSection}
          </>
        )}
      </div>
    </section>
  )
}
