/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	// Cordova is now initialized. Have fun!

	console.log(
		"Running cordova-" + cordova.platformId + "@" + cordova.version
	);
	writeMsg("Started app!");
	document.getElementById("deviceready").classList.add("ready");

	document.getElementById("start-server").addEventListener("click", () => {
		startServer();
	});

	document.getElementById("connect").addEventListener("click", () => {
		listenToServer();
	});
}

function listenToServer() {
	console.log("Listining to server");
	const Http = new XMLHttpRequest();
	Http.withCredentials = true;
	const url = "https://10.0.2.2:8081";
	writeMsg("Sending request to " + url);
	Http.open("GET", url);
	Http.send();

	Http.addEventListener("error", (e) => {
		console.log("error:", Http.status, e);
	});

	Http.onreadystatechange = (e) => {
		if (Http.readyState === XMLHttpRequest.DONE) {
			writeMsg(Http.responseText);
			writeMsg("Headers: " + Http.getAllResponseHeaders());
			console.log(Http.responseText);
		}
	};
}

function startServer() {
	console.log("start server");
	webserver.onRequest(function (request) {
		writeMsg("Request received: " + request);
		writeMsg("Headers: " + JSON.stringify(request.headers));

		webserver.sendResponse(request.requestId, {
			status: 200,
			body: "<html>Hello World</html>",
			headers: {
				"Content-Type": "text/html",
				"X-Special": "custom-header",
			},
		});
	});

	webserver.start(
		() => {
			writeMsg("Server started.");
		},
		() => {
			writeMsg("Something went wrong when starting server");
		},
		8080,
		// "www/certs/keystore.bks",
		base64_cert,
		"password"
	);
}

function writeMsg(msg) {
	console.log(msg);
	const elem = document.getElementById("server-log");
	const p = document.createElement("p");
	p.innerHTML = msg;
	elem.appendChild(p);
}

const base64_cert = "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"
