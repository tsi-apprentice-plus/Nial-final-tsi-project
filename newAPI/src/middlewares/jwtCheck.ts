import { auth } from "express-oauth2-jwt-bearer";

export const jwtCheck = auth({
  audience: "newapi",
  issuerBaseURL: "https://final-tsi-proj.uk.auth0.com/",
  tokenSigningAlg: "RS256",
});
