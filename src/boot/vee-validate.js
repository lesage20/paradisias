import { boot } from "quasar/wrappers";
import VeeValidate from "vee-validate";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VeeValidate);
});
