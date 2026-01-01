# Rock-Paper-Scissors Web App

A modern, dark-themed Rock-Paper-Scissors game built with Python Flask and Vanilla JavaScript.

## Features

- **Classic Game Logic**: Rock beats Scissors, Scissors beats Paper, Paper beats Rock.
- **Score Tracking**: Tracks your Wins, Losses, and Ties during the session.
- **Game History**: Displays a sequential log of all your moves with timestamps.
- **Theme Switcher**: Toggle between Light and Dark modes (preference saved).
- **Localization**: Supports Traditional Chinese (Default) and English.
- **Responsive Design**: Works on desktop and mobile.

## Installation

Follow these steps to set up the project locally using a Python virtual environment.

### Prerequisites

- Python 3.x installed on your system.

### Steps

1.  **Clone or Download** the project to your local machine.
2.  **Navigate** to the project directory:
    ```bash
    cd /your_project_path
    ```
3.  **Create a Virtual Environment**:
    ```bash
    python3 -m venv venv
    ```
4.  **Activate the Virtual Environment**:
    - **Linux/macOS**:
        ```bash
        source venv/bin/activate
        ```
    - **Windows**:
        ```bash
        venv\Scripts\activate
        ```
5.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## How to Play

1.  **Start the Application**:
    Ensure your virtual environment is activated, then run:
    ```bash
    python3 app.py
    ```
2.  **Open the Game**:
    Open your web browser and go to:
    [http://127.0.0.1:5000](http://127.0.0.1:5000)
3.  **Make a Move**:
    Click on one of the cards: **Rock**, **Paper**, or **Scissors**.
4.  **Check Results**:
    - See if you Won, Lost, or Tied.
    - Check the **Scoreboard** at the top for your total stats.
    - Scroll down to the **Game History** to see past games.

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
