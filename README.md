# Jarvis-v1-
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jarvis AI Assistant</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }

        .jarvis-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            text-align: center;
        }

        .jarvis-logo {
            font-size: 3em;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .status {
            font-size: 1.2em;
            margin-bottom: 20px;
            min-height: 30px;
        }

        .listening {
            color: #4CAF50;
            animation: glow 1s infinite alternate;
        }

        @keyframes glow {
            from { text-shadow: 0 0 5px #4CAF50; }
            to { text-shadow: 0 0 20px #4CAF50; }
        }

        .voice-btn {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            border: none;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            font-size: 1.5em;
            color: white;
            cursor: pointer;
            margin: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .voice-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        .voice-btn:active {
            transform: scale(0.95);
        }

        .history {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            max-height: 300px;
            overflow-y: auto;
            text-align: left;
        }

        .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 10px;
            background: rgba(255,255,255,0.2);
        }

        .user-msg { background: rgba(255,107,107,0.3); }
        .jarvis-msg { background: rgba(78,205,196,0.3); }

        .commands {
            margin-top: 20px;
            font-size: 0.9em;
            opacity: 0.8;
        }

        .time-display {
            font-size: 1.5em;
            margin-bottom: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="jarvis-container">
        <div class="jarvis-logo">🤖 JARVIS</div>
        <div class="time-display" id="timeDisplay"></div>
        <div class="status" id="status">Say "Jarvis" to activate</div>
        
        <button class="voice-btn" id="voiceBtn" onclick="toggleListening()">
            🎤
        </button>
        
        <div class="history" id="history"></div>
        <div class="commands">
            <strong>Commands:</strong> time, date, battery, weather*, calculator, jokes, news*, open camera*, flashlight*
        </div>
    </div>

    <script>
        class JarvisAI {
            constructor() {
                this.recognition = null;
                this.isListening = false;
                this.history = [];
                this.init();
            }

            init() {
                this.updateTime();
                setInterval(() => this.updateTime(), 1000);
                
                if ('webkitSpeechRecognition' in window) {
                    this.recognition = new webkitSpeechRecognition();
                    this.setupRecognition();
                } else if ('SpeechRecognition' in window) {
                    this.recognition = new SpeechRecognition();
                    this.setupRecognition();
                } else {
                    document.getElementById('status').textContent = 'Speech recognition not supported';
                }

                // Check battery
                if ('getBattery' in navigator) {
                    navigator.getBattery().then(battery => {
                        this.batteryInfo = battery;
                    });
                }
            }

            setupRecognition() {
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onstart = () => {
                    this.isListening = true;
                    this.updateStatus('🔴 Listening...', 'listening');
                };

                this.recognition.onresult = (event) => {
                    const command = event.results[0][0].transcript.toLowerCase().trim();
                    this.addToHistory('You', command);
                    this.processCommand(command);
                };

                this.recognition.onend = () => {
                    this.isListening = false;
                    if (!this.isProcessing) {
                        this.updateStatus('Say "Jarvis" to activate', '');
                    }
                };

                this.recognition.onerror = () => {
                    this.isListening = false;
                    this.updateStatus('Say "Jarvis" to activate', '');
                };
            }

            toggleListening() {
                if (this.isListening) {
                    this.recognition.stop();
                } else {
                    this.recognition.start();
                }
            }

            processCommand(command) {
                this.isProcessing = true;
                this.updateStatus('🤖 Processing...', '');

                setTimeout(() => {
                    let response = this.executeCommand(command);
                    this.addToHistory('Jarvis', response);
                    this.updateStatus('Ready!', '');
                    this.isProcessing = false;
                }, 500);
            }

            executeCommand(command) {
                // Wake word check
                if (!command.includes('jarvis') && !command.includes('hey jarvis')) {
                    return "Say 'Jarvis' first to activate me!";
                }

                if (command.includes('time')) {
                    return `The time is ${new Date().toLocaleTimeString()}`;
                }

                if (command.includes('date')) {
                    return `Today is ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}`;
                }

                if (command.includes('battery') || command.includes('charge')) {
                    if (this.batteryInfo) {
                        const level = Math.round(this.batteryInfo.level * 100);
                        const charging = this.batteryInfo.charging ? 'charging' : 'not charging';
                        return `Battery is at ${level}% and is ${charging}`;
                    }
                    return "Battery info not available";
                }

                if (command.includes('calculator') || command.includes('calculate')) {
                    const num1 = this.extractNumber(command, 1);
                    const num2 = this.extractNumber(command, 2);
                    if (num1 && num2) {
                        return `${num1} + ${num2} = ${num1 + num2}`;
                    }
                    return "Say numbers to calculate, like 'calculate 5 and 3'";
                }

                if (command.includes('joke')) {
                    const jokes = [
                        "Why don't scientists trust atoms? Because they make up everything!",
                        "Why did the scarecrow win an award? He was outstanding in his field!",
                        "Why don't eggs tell jokes? They'd crack each other up!",
                        "What do you call fake spaghetti? An impasta!"
                    ];
                    return jokes[Math.floor(Math.random() * jokes.length)];
                }

                if (command.includes('weather')) {
                    return "Weather feature requires internet. Check your weather app!";
                }

                if (command.includes('camera')) {
                    this.openCamera();
                    return "Opening camera...";
                }

                if (command.includes('flashlight') || command.includes('torch')) {
                    this.toggleFlashlight();
                    return "Toggling flashlight...";
                }

                if (command.includes('news')) {
                    return "Opening news...";
                    // window.open('https://news.google.com', '_blank');
                }

                if (command.includes('hello') || command.includes('hi')) {
                    return "Hello! How can I assist you today?";
                }

                if (command.includes('thank') || command.includes('thanks')) {
                    return "You're welcome! Always happy to help.";
                }

                if (command.includes('bye') || command.includes('goodbye')) {
                    return "Goodbye! Have a great day!";
                }

                return "I didn't understand that command. Try 'time', 'date', 'battery', 'calculator', or 'joke'";
            }

            extractNumber(command, index) {
                const words = command.split(' ');
                const numbers = words.filter(word => !isNaN(word.replace(/[^\d]/g, '')));
                return numbers[index - 1] ? parseFloat(numbers[index - 1]) : null;
            }

            openCamera() {
                // For PWA/Cordova - request camera permission
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => {
                            // Camera access granted
                        })
                        .catch(err => {
                            console.log('Camera access denied');
                        });
                }
            }

            toggleFlashlight() {
                // For native apps or PWA with permissions
                console.log('Flashlight toggle requested');
                // Implement native flashlight toggle via Cordova/PhoneGap plugin
            }

            updateTime() {
                const now = new Date();
                document.getElementById('timeDisplay').textContent = 
                    now.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    });
            }

            updateStatus(text, className) {
                const statusEl = document.getElementById('status');
                statusEl.textContent = text;
                statusEl.className = className ? `status ${className}` : 'status';
            }

            addToHistory(speaker, text) {
                this.history.push({ speaker, text });
                const historyEl = document.getElementById('history');
                const messageEl = document.createElement('div');
                messageEl.className = `message ${speaker === 'You' ? 'user-msg' : 'jarvis-msg'}`;
                messageEl.innerHTML = `<strong>${speaker}:</strong> ${text}`;
                historyEl.appendChild(messageEl);
                historyEl.scrollTop = historyEl.scrollHeight;
                
                // Keep only last 10 messages
                while (this.history.length > 10) {
                    historyEl.removeChild(historyEl.firstChild);
                    this.history.shift();
                }
            }
        }

        // Initialize Jarvis
        const jarvis = new JarvisAI();

        // Global functions for button
        function toggleListening() {
            jarvis.toggleListening();
        }
    </script>
</body>
</html>
