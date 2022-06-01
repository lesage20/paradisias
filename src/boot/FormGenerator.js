import { boot } from "quasar/wrappers";
import FormGenerator from "../components/FormGenerator.vue";
import QCalendar from "@quasar/quasar-ui-qcalendar/src/QCalendarDay.js";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.component("FormGenerator", FormGenerator);
  app.component(QCalendar);
});
