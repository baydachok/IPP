import requests
from tkinter import *

# Функция для получения информации о репозиториях пользователя
def get_repositories(username):
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url)
    repositories = response.json()
    return repositories

# Функция для отображения информации о репозиториях
def show_repositories():
    username = entry.get()
    repositories = get_repositories(username)
    for repository in repositories:
        name = repository["name"]
        language = repository["language"]
        stars = repository["stargazers_count"]
        label = Label(root, text=f"Repository: {name}\nLanguage: {language}\nStars: {stars}\n")
        label.pack()

# Создание графического интерфейса
root = Tk()
root.title("GitHub API Demo")
root.geometry("400x400")

label = Label(root, text="Enter GitHub username:")
label.pack()

entry = Entry(root, width=30)
entry.pack()

button = Button(root, text="Get Repositories", command=show_repositories)
button.pack()

root.mainloop()