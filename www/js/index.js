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
		"www/certs/keystore.bks",
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
