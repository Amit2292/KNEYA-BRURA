import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, recordClick } from '@/lib/db/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: { productSlug: string } }
) {
  const { productSlug } = params

  try {
    const product = await getProductBySlug(productSlug)

    if (!product) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const affiliateLink = product.affiliate_links?.[0]

    // Record click (fire and forget - don't block redirect)
    recordClick(
      product.id,
      request.headers.get('referer') ?? undefined,
      request.headers.get('user-agent') ?? undefined
    ).catch((err) => console.error('[Click tracking error]', err))

    if (!affiliateLink?.affiliate_url) {
      // No affiliate link - redirect to product page with a note
      const productUrl = new URL(`/p/${productSlug}`, request.url)
      productUrl.searchParams.set('notice', 'no-link')
      return NextResponse.redirect(productUrl)
    }

    // Redirect to affiliate URL
    return NextResponse.redirect(affiliateLink.affiliate_url, { status: 302 })
  } catch (err) {
    console.error('[Go route error]', err)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
