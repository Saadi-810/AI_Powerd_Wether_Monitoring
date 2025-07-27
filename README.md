# Weather Chat Dashboard

## Overview

The Weather Chat Dashboard is a web application that displays real-time weather data collected from a DHT11 sensor and provides a chat interface for interacting with a weather-related AI. The application is built using Flask for the backend and includes a responsive frontend with charts for visualizing temperature and humidity data.

## Features

- Real-time temperature and humidity monitoring
- Data visualization with interactive charts
- Chat interface for asking weather-related questions
- Responsive design with a dark theme

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/weather-chat-dashboard.git
   cd weather-chat-dashboard
   ```

2. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the DHT11 sensor:**

   - Connect the DHT11 sensor to the GPIO pins of your Raspberry Pi or other compatible hardware.
   - Ensure the sensor is properly connected and powered.

4. **Set up the Mistral API key:**

   - Create a `.env` file in the project root directory.
   - Add your Mistral API key to the `.env` file:

     ```plaintext
     MISTRAL_API_KEY=your_api_key_here
     ```

5. **Run the application:**

   ```bash
   python app.py
   ```

   The application will start a Flask server on `http://localhost:5050`.

## Usage

1. **Access the dashboard:**

   Open your web browser and navigate to `http://localhost:5050`. You will see the dashboard with real-time temperature and humidity data.

2. **Interact with the chat:**

   Use the chat interface to ask weather-related questions. The chat uses an external API to provide responses based on the latest sensor data.

3. **View the data:**

   The dashboard includes interactive charts for visualizing temperature and humidity data over time. You can hover over the charts to see detailed information.

## Project Structure

- `app.py`: The main application file that runs the Flask server and handles sensor data collection and API interactions.
- `requirements.txt`: Lists the project's dependencies.
- `templates/index.html`: The main HTML file for the dashboard.
- `static/script.js`: The JavaScript file that handles the frontend logic.
- `static/style.css`: The CSS file for styling the dashboard.
- `System diagrams/`: Contains diagrams related to the system architecture and hardware setup.

## Chat API

The chat feature uses the Mistral API to provide responses to user queries. The API key is stored in the `app.py` file and should be kept secure. The chat endpoint is `/chat`, and it accepts POST requests with a JSON payload containing the user's message.

## Hardware Setup

The project uses a DHT11 sensor to collect temperature and humidity data. The sensor is connected to the GPIO pins of a Raspberry Pi or other compatible hardware. The `app.py` file includes code for initializing and reading data from the sensor.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Adafruit CircuitPython DHT](https://github.com/adafruit/Adafruit_CircuitPython_DHT) for sensor interaction
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Mistral API](https://api.mistral.ai/) for chat functionality
