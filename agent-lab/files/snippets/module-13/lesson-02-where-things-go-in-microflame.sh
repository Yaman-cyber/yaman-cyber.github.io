// the request's journey
POST /api/v1/docbot/ask
  → routes/api/v1/docbot.routes.js          # URL + auth middleware
  → middlewares/auth/auth.js                # sets req.user from the JWT
  → controllers/api/v1/docbot.controller.js
      → validators/docbot/ask-valid.js      # Joi checks the body
      → services/agent/docbot.service.js    # Module 12
  → middlewares/response.js                 # { data, success, message, metadata }

# generate the controller file:
microflame generate controller v1/docbot --mode api
