FROM python:3.12
WORKDIR /app
ADD . /app
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
