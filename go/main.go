package main

import (
	"encoding/json"
	"net/http"
)

type Order struct {
	OrderID      int     `json:"order_id"`
	CustomerName string  `json:"-"`
	Price        float64 `json:"price"`
}

func (p Order) getPrice() float64 {
	return p.Price
}

func main() {
	http.HandleFunc("/", HelloHandler)
	http.ListenAndServe(":8081", nil)
}

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	order := Order{OrderID: 1234, CustomerName: "Jane Doe", Price: 12.09}

	json.NewEncoder(w).Encode(order)
}
