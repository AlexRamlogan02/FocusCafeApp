// Mirrors the shape returned by the get-user-data lambda's standardResponse()
export const userDataMock = {
  success: true,
  code: 202,
  message: 'User data retrieved successfully',
  data: {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    streak: 5
  },
  meta: {},
}