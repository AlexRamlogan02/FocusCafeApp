const tableName = process.env.DYNAMODB_TABLE_NAME || "focus-cafe-app-dev-main";

function getTableName() {
  return tableName;
}

module.exports = {
  getTableName,
};
