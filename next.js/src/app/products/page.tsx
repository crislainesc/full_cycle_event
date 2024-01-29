import Image from 'next/image'
import { CountButtonClick } from '../components/CountButtonClick'

export interface IProduct {
  id: string
  name: string
  description: string
  image_url: string
  price: number
  category_id: number
}

async function getProducts(): Promise<IProduct[]> {
  const response = await fetch('http://localhost:8000/products', {
    cache: 'no-store',
    // next: {
    //   revalidate: 10,
    // },
  })
  return response.json()
}

async function ProductsListPage() {
  const products = await getProducts()

  return (
    <div>
      <h2>Products List</h2>
      <ul>
        {products.map((product) => {
          const imageDimensions = product.image_url.split('/').pop()
          const [width, height] = imageDimensions
            ? imageDimensions?.split('x')
            : []

          return (
            <li key={product.id}>
              {product.name}
              <Image
                src={product.image_url}
                alt={product.description}
                width={+width ?? 200}
                height={+height ?? 200}
              />
            </li>
          )
        })}
      </ul>
      <CountButtonClick />
    </div>
  )
}

export default ProductsListPage
