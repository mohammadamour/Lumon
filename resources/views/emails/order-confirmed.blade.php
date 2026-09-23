<x-mail::message>
# Order Confirmed! 🎉

Hi {{ $user->name }},

Thank you for your order! We're getting everything ready for you.

---

## Order #{{ $order->id }}

**Status:** {{ ucfirst($order->status) }}
**Shipping To:** {{ $order->shipping_address }}

---

### Items Ordered

<x-mail::table>
| Product | Qty | Price | Subtotal |
|:--------|:---:|------:|---------:|
@foreach ($items as $item)
| {{ $item->product->name ?? 'Unknown Product' }} | {{ $item->quantity }} | ${{ number_format($item->price, 2) }} | ${{ number_format($item->price * $item->quantity, 2) }} |
@endforeach
| | | **Total** | **${{ number_format($order->total_amount, 2) }}** |
</x-mail::table>

---

We'll send you another update when your order ships.

<x-mail::button :url="config('app.url') . '/orders'" color="primary">
View Your Orders
</x-mail::button>

Thanks for shopping with us,<br>
{{ config('app.name') }}
</x-mail::message>
