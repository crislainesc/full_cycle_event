'use client'

import { useEffect, useState } from 'react'

export interface IProduct {
  id: string
  name: string
  description: string
  image_url: string
  price: number
  category_id: number
}

function ProductsListPage() {
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
  }, [])

  return (
    <div>
      <h2>Products List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProductsListPage
