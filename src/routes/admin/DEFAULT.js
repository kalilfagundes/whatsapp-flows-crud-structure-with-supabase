/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// this object is generated from Flow Builder under "..." > Endpoint > Snippets > Responses

import { WELCOME } from './WELCOME.js';
import { MANAGE_PROFESSIONAL } from './MANAGE_PROFESSIONAL.js';
import { ADD_PROFESSIONAL } from './ADD_PROFESSIONAL.js';
import { EDIT_PROFESSIONAL } from './EDIT_PROFESSIONAL.js';

export const SCREEN_RESPONSES = {
  WELCOME: {
    "screen": "WELCOME",
    "data": {}
  },
  MANAGE_PROFESSIONAL: {
    "screen": "MANAGE_PROFESSIONAL",
    "data": {
      "action_professional": "edit_professional",
      "professional": [
        {
          "id": "1",
          "title": "João"
        },
        {
          "id": "2",
          "title": "Maria"
        }
      ]
    }
  },
  EDIT_PROFESSIONAL: {
    "screen": "EDIT_PROFESSIONAL",
    "data": {
      "action_professional": "edit_professional",
      "professional": "ID_PROF_123"
    }
  },
  ADD_PROFESSIONAL: {
    "screen": "ADD_PROFESSIONAL",
    "data": {
      "action_professional": "add_professional",
      "professional": "null"
    }
  },
  VIEW_SCHEDULE: {
    "screen": "VIEW_SCHEDULE",
    "data": {
      "choosenDay": "2025-12-07",
      "scheduleData": "Agenda vazia"
    }
  },
  DONE: {
    "screen": "DONE",
    "data": {
      "choosenDay": "2025-12-07",
      "scheduleData": "Agenda vazia",
      "professional": "ID_PROF_123",
      "professionalName": "José Silva",
      "professionalWorkingDays": "['monday', 'tuesday']",
      "professionalWorkingTime": "['08:00', '08:30']"
    }
  },
  SUCCESS: {
    "screen": "SUCCESS",
    "data": {
      "extension_message_response": {
        "params": {
          "flow_token": "REPLACE_FLOW_TOKEN",
          "some_param_name": "PASS_CUSTOM_VALUE"
        }
      }
    }
  },
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display WELCOME screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.WELCOME,
      data: {
        ...SCREEN_RESPONSES.WELCOME.data,
      },
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user interacts with WELCOME screen
      case "WELCOME":
        return await WELCOME(decryptedBody);

      case "MANAGE_PROFESSIONAL":
        return await MANAGE_PROFESSIONAL(decryptedBody);

      case "ADD_PROFESSIONAL":
        return await ADD_PROFESSIONAL(decryptedBody);

      case "EDIT_PROFESSIONAL":
        return await EDIT_PROFESSIONAL(decryptedBody);

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
