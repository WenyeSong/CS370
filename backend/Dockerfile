# build a Docker image of the back-end service

# use an official Python runtime as a parent image
FROM python:3.10.10-slim

# set the working directory in the container
WORKDIR /app

# copy the current directory contents into the container at /app
COPY ./requirements.txt /app/requirements.txt

# install packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# make port 8080 available to the world outside this container
COPY . /app

# define environment variable
CMD ["python", "main.py"]



# run main.py when the container launches
#CMD ["python", "main.py"]

# run gunicorn when the conta
