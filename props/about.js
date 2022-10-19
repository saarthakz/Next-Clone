import admin from "firebase-admin";

export default async function getProps() {
  console.log(admin.SDK_VERSION);
  return {};
};