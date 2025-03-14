import { getPaymentStatusDisplay } from './PaymentStatusBadge';

// ... in your table cell
<td className="px-6 py-4 whitespace-nowrap">
  {payment.status && (
    <div className="space-y-1">
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusDisplay(payment).className}`}>
        {getPaymentStatusDisplay(payment).text}
      </span>
      {payment.status === 'PARTIAL' && (
        <p className="text-xs text-red-600">
          Due: ${payment.balance?.toLocaleString()}
        </p>
      )}
    </div>
  )}
</td>