export const handler = async () => {
  return {
    body: JSON.stringify({
      message: 'Hello'
    }),
    statusCode: 200
  }
}