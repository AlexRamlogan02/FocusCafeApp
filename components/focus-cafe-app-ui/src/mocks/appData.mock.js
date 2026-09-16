// Mirrors the shape returned by the get-app-data lambda's standardResponse()
export const appDataMock = {
  success: true,
  code: 202,
  message: 'App data retrieved successfully',
  data: {
    menu: [
      {
        id: 'espresso',
        name: 'Espresso',
        price: 3.5,
        category: 'coffee',
      },
      {
        id: 'latte',
        name: 'Latte',
        price: 4.5,
        category: 'coffee',
      },
      {
        id: 'croissant',
        name: 'Croissant',
        price: 3.0,
        category: 'pastry',
      },
    ],
  },
  meta: {},
}
