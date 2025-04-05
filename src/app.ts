import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const FLOWSHEET_ID = 1


import { client } from '../gen_api/client.gen';
import { unitopsSimulationobjectsCreate } from "../gen_api";

client.setConfig({
  baseUrl: 'http://localhost:8001/',
});


// const res = await unitopsSimulationobjectsCreate({
//     body: {
//         flowsheetOwner: FLOWSHEET_ID,
//         x: "0",
//         y: "0",
//         componentName: "test",
//         objectType: "pump",}
// })

// console.log(res.data)


console.log("UnitOps created")



// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add numbers",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Tool for creating a new simulation object
server.tool("create simulation object",
    {
        name: z.string(),
        type: z.enum(["heater", "cooler", "pump", "valve"]),
    },
    async ({ name, type }) => {
        const res = await unitopsSimulationobjectsCreate({
            body: {
                flowsheetOwner: FLOWSHEET_ID,
                x: "0",
                y: "0",
                componentName: name,
                objectType: type,
            }
        })

        console.log(res.data)

        return {
            content: [{
                type: "text",
                text: `Created ${res.data.objectType} named ${res.data.componentName} with id ${res.data.id}`
            }]
        }
    }
)



// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

console.log("Server started, waiting for connection...");
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);