/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// this object is generated from Flow Builder under "..." > Endpoint > Snippets > Responses

import { APPOINTMENT } from './APPOINTMENT.js';
import { DETAILS } from './DETAILS.js';
import { SUMMARY } from './SUMMARY.js';
import { findProfessionals } from '../../functions/professionals.js';
import { findServices } from '../../functions/services.js';

export const SCREEN_RESPONSES = {
  APPOINTMENT: {
    screen: "APPOINTMENT",
    data: {
      professionals: [],
      services: [],
      date: [],
      time: [],
    },
  },
  DETAILS: {
    screen: "DETAILS",
    data: {
      appointment: "",
      professionals: "",
      services: "",
      date: "",
      time: "",
    },
  },
  SUMMARY: {
    screen: "SUMMARY",
    data: {
      appointment_summary: "",
      professionals: "",
      services: "",
      date: "",
      time: "",
    },
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "",
        },
      },
    },
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

  // handle initial request when opening the flow and display APPOINTMENT screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.APPOINTMENT,
      data: {
        ...SCREEN_RESPONSES.APPOINTMENT.data,
        // these fields are disabled initially. Each field is enabled when previous fields are selected
        professionals: await findProfessionals(),
        is_professional_available: true,
        is_service_available: false,
        is_date_enabled: false,
        is_time_enabled: false,
      },
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user interacts with APPOINTMENT screen
      case "APPOINTMENT":
        return await APPOINTMENT(decryptedBody);

      // handles when user completes DETAILS screen
      case "DETAILS":
        return await DETAILS(decryptedBody);

      case "SUMMARY":
        return await SUMMARY(decryptedBody);

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
