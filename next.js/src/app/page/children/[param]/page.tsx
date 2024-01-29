function ChildrenWithParam(request: {
  params: { param: string }
  searchParams: { query_param: string }
}) {
  const { param } = request.params
  const { query_param = 'default' } = request.searchParams

  // sanitization
  return (
    <div>
      Children 1: {param},{query_param}
    </div>
  )
}

export default ChildrenWithParam
