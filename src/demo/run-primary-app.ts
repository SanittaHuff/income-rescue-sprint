import { writeFileSync } from "node:fs";
import { initialPrivateMvpUiState } from "../frontend/app/private-mvp-model.js";
import { renderPrivateMvpHtml } from "../frontend/app/render-private-mvp.js";
writeFileSync("primary-private-mvp-app.html", renderPrivateMvpHtml(initialPrivateMvpUiState()), "utf8");
console.log("Generated primary-private-mvp-app.html");
